---
title: 'Wrapping Callback and Event APIs in Promises Without Losing Failures'
description: 'How to adapt Node.js callbacks, EventEmitters, and streams to Promises without losing errors, cleanup, cancellation, or ownership.'
date: 2023-01-14
updated: 2026-08-01
banner: /images/blog/callbacks-events-promises.png
bannerAlt: 'Colored threads tied into one loop with red and amber strands preserved'
---

Turning a callback or an event into a Promise looks like a mechanical refactor. Put the old API inside `new Promise`, call `resolve` on success, call `reject` on failure, and enjoy `await`.

That is the easy part. The real job is preserving the old API's contract.

I need to know which signal means success, every way the operation can fail, who removes listeners, whether cancellation stops the work or merely stops waiting, and who owns the resource after the Promise settles. Event-driven APIs make this harder because one operation can produce data many times, emit an error, end normally, close early, or be aborted by its caller. A Promise, meanwhile, records exactly one eventual outcome.

A correct adapter is therefore not “callback syntax, but prettier.” It is a small state machine at a boundary I own.

# Start with the shape of the source API

Before writing an adapter, I classify the API.

A Node-style callback reports one completion through a final function whose first argument is an error and whose remaining arguments contain success values. That is what [`util.promisify`](https://nodejs.org/api/util.html#utilpromisifyoriginal) is designed for.

An `EventEmitter` reports named events, possibly more than once. Node's [`events.once`](https://nodejs.org/api/events.html#eventsonceemitter-name-options) is useful when one event is the complete success value and the normal `'error'` convention applies.

A stream or richer emitter usually has a protocol rather than a single event: zero or more `'data'` events, then `'end'`; perhaps `'error'`; perhaps `'close'` before completion. That often needs a custom adapter—or, for standard streams, an existing high-level Node API such as `node:stream/consumers` or `node:stream/promises`.

These tools overlap in syntax, not in responsibility. `promisify` does not understand event emitters. `events.once` does not aggregate a stream. A custom Promise does not become correct merely because JavaScript ignores a second call to `resolve` or `reject`.

# `util.promisify` is for one error-first callback

Here is the narrow case it handles well:

```js
import { readFile } from 'node:fs';
import { promisify } from 'node:util';

const readFileAsync = promisify(readFile);

try {
	const text = await readFileAsync(new URL('./package.json', import.meta.url), 'utf8');
	console.log(JSON.parse(text).name);
} catch (error) {
	console.error('Could not read package.json', error);
}
```

`promisify` assumes the original function accepts a callback as its final argument and calls it in the form `(error, value)`. A truthy first argument rejects; otherwise the returned Promise resolves with the success value. If an API uses `(value)`, separate success and failure callbacks, or several meaningful success arguments, that assumption is wrong. The API can expose a custom implementation through `util.promisify.custom`, but I would rather use the library's official Promise API when one exists.

Method context is another part of the contract. Pulling a method off an object can lose its `this` value:

```js
import { promisify } from 'node:util';

class Counter {
	value = 41;

	read(callback) {
		callback(null, this.value + 1);
	}
}

const counter = new Counter();
const readCounter = promisify(counter.read.bind(counter));
console.log(await readCounter()); // 42
```

The explicit `bind` is not ceremony; `read` depends on its owner. Node's documentation calls out this class of mistake. Current Node also deprecates calling `promisify` on a function that already returns a Promise, which is another reason to inspect the source API instead of wrapping by reflex.

There is an important limit around cancellation. Promisifying a callback changes how I observe completion. It does not invent a way to stop the underlying operation. If the original API accepts an `AbortSignal`, I pass it through according to that API's signature. If it returns a cancellation handle, a generic `promisify` call cannot express that ownership cleanly; I write a custom adapter or use an official Promise variant.

## When a callback needs a custom adapter

A nonstandard callback API can still be wrapped, but I have to encode its actual rules. This runnable example models an old API that returns a cancellation function:

```js
function legacyLookup(id, callback) {
	const timer = setTimeout(() => {
		if (id === '') callback(new Error('An id is required'));
		else callback(null, { id, active: true });
	}, 25);

	return () => clearTimeout(timer);
}

function lookup(id, { signal } = {}) {
	return new Promise((resolve, reject) => {
		let cancel = () => {};
		let settled = false;

		const cleanup = () => signal?.removeEventListener('abort', onAbort);
		const finish = (action) => {
			if (settled) return;
			settled = true;
			cleanup();
			action();
		};
		const onAbort = () => {
			cancel();
			const error =
				signal.reason instanceof Error
					? signal.reason
					: new DOMException('Lookup was aborted', 'AbortError');
			finish(() => reject(error));
		};

		if (signal?.aborted) {
			onAbort();
			return;
		}
		signal?.addEventListener('abort', onAbort, { once: true });

		try {
			cancel = legacyLookup(id, (error, value) => {
				if (error) finish(() => reject(error));
				else finish(() => resolve(value));
			});
		} catch (error) {
			finish(() => reject(error));
		}
	});
}

const controller = new AbortController();

try {
	console.log(await lookup('account-42', { signal: controller.signal }));
} catch (error) {
	console.error('Lookup failed', error);
}
```

The adapter catches a synchronous throw as well as callback errors. It unsubscribes from the signal after any outcome, and abort invokes the cancellation operation before rejecting. The no-op initial `cancel` also makes an already-aborted signal safe before the legacy operation exists.

One caveat is visible in the interface: `clearTimeout` prevents the callback but provides no cleanup acknowledgment. This adapter can truthfully promise “the lookup result or an abort,” not “the remote system has confirmed cancellation.” If cancellation itself were asynchronous or fallible, I would need to decide whether the Promise waits for that acknowledgment, which error wins, and whether cleanup has a separate reporting channel. Hiding those decisions behind `new Promise` would not remove them.

# `events.once` waits for one named event

Node exports a Promise-returning `once` function that is different from `emitter.once`. The latter registers a callback. The former returns a Promise that resolves with an array of arguments emitted for the named event.

```js
import { EventEmitter, once } from 'node:events';

const job = new EventEmitter();
const controller = new AbortController();

const completion = once(job, 'ready', { signal: controller.signal });

queueMicrotask(() => {
	job.emit('ready', { port: 3000 }, 'local');
});

try {
	const [server, environment] = await completion;
	console.log(server.port, environment);
} catch (error) {
	console.error('The job failed or waiting was aborted', error);
}
```

When `once(emitter, 'ready')` is waiting, an `'error'` event rejects the Promise. That special handling does not apply when the requested event itself is `'error'`; in that case an emitted error is the successful value being awaited. Passing a signal makes the wait reject with an `AbortError` when aborted. It does not necessarily cancel `job`; it cancels this subscription. The producer only stops if its own API connects that same signal, or if I explicitly invoke its cancellation operation.

`events.once` handles listener removal for the listeners it installs. I still need to register the wait before starting work that may emit synchronously:

```js
const ready = once(job, 'ready');
job.start();
const [result] = await ready;
```

If I call `start()` first, a synchronous `'ready'` emission is gone forever before the listener exists.

Multiple terminal events need simultaneous registration, not sequential `await`s. Suppose a child-like emitter can either exit or fail to spawn:

```js
const exited = once(job, 'exit');
const failed = once(job, 'spawnError');

const outcome = await Promise.race([
	exited.then(([code]) => ({ type: 'exit', code })),
	failed.then(([error]) => ({ type: 'spawnError', error }))
]);
```

This avoids missing an event, but it leaves the losing `once` subscription alive until its event eventually occurs. It can also leave a losing Promise that later rejects without an observer if I construct the race carelessly. For a true “one of these terminal signals” protocol, I prefer one custom adapter that removes every listener when any path wins. `Promise.race` settles the aggregate; it does not cancel the losers.

# A custom adapter owns a settlement protocol

The original version of this article came from generating PDFs with PDFKit. The important fact remains current: a `PDFDocument` is a readable Node stream. [PDFKit's guide](https://pdfkit.org/docs/getting_started.html) says to pipe it to a destination and call `doc.end()` after adding content, while its [current `PDFDocument` source](https://github.com/foliojs/pdfkit/blob/master/lib/document.js) extends Node's `stream.Readable`. Therefore `'data'`, `'end'`, `'error'`, destruction, and backpressure are stream concerns rather than a callback for `doc.end()`.

For an in-memory PDF, I can make that protocol explicit:

```js
import PDFDocument from 'pdfkit';

export function renderPdf(build, { signal } = {}) {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument();
		const chunks = [];
		let settled = false;

		const cleanup = () => {
			doc.off('data', onData);
			doc.off('end', onEnd);
			doc.off('error', onError);
			doc.off('close', onClose);
			signal?.removeEventListener('abort', onAbort);
		};

		const finish = (action) => {
			if (settled) return;
			settled = true;
			cleanup();
			action();
		};

		const onData = (chunk) => chunks.push(Buffer.from(chunk));
		const onEnd = () => finish(() => resolve(Buffer.concat(chunks)));
		const onError = (error) => finish(() => reject(error));
		const onClose = () => finish(() => reject(new Error('PDF stream closed before ending')));
		const onAbort = () => {
			doc.destroy();
			const error =
				signal.reason instanceof Error
					? signal.reason
					: new DOMException('PDF rendering was aborted', 'AbortError');
			finish(() => reject(error));
		};

		doc.on('data', onData);
		doc.once('end', onEnd);
		doc.once('error', onError);
		doc.once('close', onClose);

		if (signal?.aborted) {
			onAbort();
			return;
		}
		signal?.addEventListener('abort', onAbort, { once: true });

		try {
			build(doc);
			doc.end();
		} catch (error) {
			doc.destroy();
			finish(() => reject(error));
		}
	});
}

const controller = new AbortController();

try {
	const pdf = await renderPdf(
		(doc) => {
			doc.fontSize(18).text('Promises preserve contracts');
			doc.moveDown().fontSize(11).text('Success is only one path.');
		},
		{ signal: controller.signal }
	);

	console.log(`Rendered ${pdf.length} bytes`);
} catch (error) {
	console.error('PDF generation failed', error);
}
```

This adapter has one success condition: the readable stream emits `'end'`, after all chunks have arrived. It has three failure conditions: the stream emits `'error'`, it closes before ending, or the caller aborts. A synchronous exception from `build` or `doc.end()` is also a rejection. Every terminal path passes through `finish`, which makes settlement idempotent and removes all listeners.

The `settled` flag is not there because Promises can settle twice—they cannot. It protects the surrounding side effects. Without it, an error followed by a close could run cleanup or resource actions twice even though only the first `reject` changes the Promise.

Listener ordering matters. I attach failure listeners before calling caller-supplied `build`, because that code may throw or cause stream activity. I check `signal.aborted` before subscribing, then use `{ once: true }`, following Node's `AbortSignal` guidance. Cleanup removes the abort listener when rendering wins, so a long-lived signal does not retain the whole render closure.

I destroy the document without passing an error on explicit abort or a synchronous build failure. The adapter already rejects with the intended error. Passing an error to `destroy(error)` and immediately removing the `'error'` listener can schedule an unhandled `'error'` event after cleanup. One failure should have one owner.

This function also makes ownership unusually clear: it constructs the document, consumes it, finalizes it, and destroys it on cancellation. Callers receive only an immutable result-shaped value, the `Buffer`. If callers supplied an already-shared stream instead, destroying it on abort might break another consumer. An adapter may stop listening to a borrowed resource, but it should only destroy a resource it owns or has an explicit contract to control.

There is a memory tradeoff here. Collecting chunks is appropriate only when the maximum PDF size fits comfortably in memory. For large documents, I would pipe to a file, HTTP response, or object-store upload and await the destination's completion. In that design, readable `'end'` means PDFKit finished producing bytes, while writable `'finish'` means the destination accepted all writes. They are different ownership boundaries. Node's `pipeline` is usually safer than hand-wiring stream errors because it coordinates the whole pipe and destroys streams on failure.

# Cancellation must say what stopped

An `AbortSignal` is notification, not magic. My adapter has to define its effect.

There are three common contracts:

1. **Stop waiting.** Remove listeners and reject, while a borrowed producer continues.
2. **Request cancellation.** Forward the signal or call the producer's documented cancel method.
3. **Destroy owned work.** Tear down a stream, socket, child process, or document created exclusively for this operation.

Conflating them creates leaks and surprising collateral damage. Rejecting a Promise does not stop a timer, network request, PDF render, or emitter. Conversely, destroying a shared emitter merely because one waiter lost interest is too aggressive.

I also preserve the abort reason when it is an `Error`. That lets a timeout or parent operation explain why cancellation happened. The fallback `DOMException` provides the conventional `AbortError` shape. A caller should still observe the returned Promise with `await`, `catch`, or another combinator. Cancellation is a rejection path, and an ignored rejected Promise is still eligible for an unhandled-rejection report.

# The checklist I use

Before shipping an adapter, I can answer these questions without reading its implementation twice:

- What exact signal means success, and can it happen synchronously?
- Which callbacks, events, exceptions, closes, or aborts mean failure?
- Are all terminal listeners installed before work starts and removed after one path wins?
- Does cancellation stop waiting, request cancellation, or destroy the producer?
- Who owns the resource, and is any buffering bounded for the real payload?
- Can every losing rejection and the returned Promise still be observed?

The syntax is still small. The thinking is not. `util.promisify` is excellent for a conventional final callback. `events.once` is excellent for one named event with Node's error convention and optional abortable waiting. A custom Promise adapter is justified when the source exposes a real protocol that those tools cannot represent.

I no longer call that work “promisifying an API.” I am translating a lifecycle.
