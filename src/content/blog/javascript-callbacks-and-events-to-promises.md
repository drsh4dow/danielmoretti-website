---
title: 'Wrapping Callback and Event APIs in Promises Without Losing Failures'
description: 'How to wrap callback and event APIs without losing errors, cleanup, or ownership.'
date: 2023-01-14
updated: 2026-08-01
banner: /images/blog/callbacks-events-promises.png
bannerAlt: 'Colored threads tied into one loop with red and amber strands preserved'
---

Wrapping an old API in `new Promise` is easy. The bug usually arrives later: an event fires before its listener exists, a losing listener stays attached, abort rejects the Promise but leaves the work running, or a stream resolves before its destination has finished writing.

The syntax changed, but the contract did not survive.

That contract is what I adapt. I need one precise success condition, every real failure path, and clear answers about cleanup, cancellation, and resource ownership. A Promise records one outcome. The source API may describe an entire lifecycle.

# Choose the adapter from the source

Use [`util.promisify`](https://nodejs.org/api/util.html#utilpromisifyoriginal) for a conventional Node callback that completes once and reports `(error, value)`. Use [`events.once`](https://nodejs.org/api/events.html#eventsonceemitter-name-options) when one named event is the complete result; while waiting for another event it also rejects on `'error'`, and an `AbortSignal` can stop the wait. Neither helper invents cancellation for the underlying work. Streams carry many chunks and distinguish producer completion from destination completion, so I use stream helpers rather than flattening them into one hand-picked event. Anything with several terminal events or a nonstandard callback needs a small adapter that states which outcome wins and removes the rest.

The wait must exist before work starts because an emitter may fire synchronously:

```js
const ready = once(job, 'ready');
job.start();
const [result] = await ready;
```

Starting first creates a race that no Promise syntax can repair afterward. `events.once` resolves to an array because one emission may carry several arguments. Its signal removes the listeners installed for that wait, but it does not necessarily stop `job`; those are separate operations with separate owners.

# One settlement point for several events

Suppose a job can exit, fail during startup, or be abandoned by its caller. Racing separate `once` calls looks compact, but settlement does not remove the losing wait. If exit wins, the startup-error listener may remain attached indefinitely. I install every terminal listener together and make cleanup part of settlement:

```js
function waitForJob(job, { signal } = {}) {
	return new Promise((resolve, reject) => {
		let settled = false;

		const cleanup = () => {
			job.off('exit', onExit);
			job.off('spawnError', onSpawnError);
			signal?.removeEventListener('abort', onAbort);
		};
		const finish = (action) => {
			if (settled) return;
			settled = true;
			cleanup();
			action();
		};
		const onExit = (code) => finish(() => resolve({ type: 'exit', code }));
		const onSpawnError = (error) => finish(() => reject(error));
		const onAbort = () => {
			const error =
				signal.reason instanceof Error
					? signal.reason
					: new DOMException('Waiting for the job was aborted', 'AbortError');
			finish(() => reject(error));
		};

		job.once('exit', onExit);
		job.once('spawnError', onSpawnError);

		if (signal?.aborted) {
			onAbort();
			return;
		}
		signal?.addEventListener('abort', onAbort, { once: true });
	});
}
```

Promises already ignore settlement after the first result. The flag protects the surrounding side effects: an error followed by an exit still performs cleanup once, and every path removes the abort listener as well as the job listeners. Listener order matters too. Terminal and failure listeners must be installed before any call that can start work or invoke caller-supplied code. The already-aborted check comes after the job listeners are attached and before the abort listener is added. That sequence covers a signal that was aborted before the function was called without leaving job listeners behind.

This adapter deliberately models only three outcomes. It does not decide whether a nonzero exit code is a rejected operation, because that meaning belongs to the job's contract rather than `EventEmitter`. The resolved object preserves the exit result so its caller can make that decision.

Abort here means “stop waiting.” Rejecting a Promise is not cancellation; the job may continue after the wrapper settles. A wrapper may invoke a source cancellation operation, and may claim that the source was cancelled, only when an explicit contract says the wrapper owns that operation and defines what acknowledgment the source provides. Without that owner/source contract, the honest result is merely that waiting ended.

# Destination completion is the stream result

PDFKit exposed the concrete failure that changed how I think about these wrappers. A `PDFDocument` is a readable Node stream: [PDFKit's guide](https://pdfkit.org/docs/getting_started.html) pipes it to a destination and calls `doc.end()` after content is added, and the [current `PDFDocument` source](https://github.com/foliojs/pdfkit/blob/master/lib/document.js) extends `stream.Readable`.

Calling `doc.end()` does not mean the file has finished. Readable `'end'` means PDFKit produced all bytes; writable `'finish'` means the destination accepted all writes. Resolving on the readable side can let the caller move, upload, or report a file while the writable side is still flushing or has failed. `pipeline` coordinates both streams and their errors:

```js
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import PDFDocument from 'pdfkit';

export async function writePdf(path, build, { signal } = {}) {
	const doc = new PDFDocument();
	const destination = createWriteStream(path);
	const completed = pipeline(doc, destination, { signal });

	try {
		build(doc);
		doc.end();
		await completed;
	} catch (error) {
		doc.destroy();
		destination.destroy();
		try {
			await completed;
		} catch {
			// Keep the original build or pipeline error.
		}
		throw error;
	}
}

await writePdf('invoice.pdf', (doc) => {
	doc.fontSize(18).text('Promises preserve contracts');
	doc.moveDown().fontSize(11).text('Success is only one path.');
});
```

Success here is writable destination completion. `build` can also throw before `doc.end()`, so the same failure path destroys the streams and waits for the pipeline to settle. The nested catch keeps that cleanup failure from replacing the original build or pipeline error.

The function creates both streams, so it may destroy them after failure or abort. A borrowed or shared stream is different: the wrapper may stop listening, but destroying somebody else's resource exceeds its ownership. Accepting a destination from the caller would therefore require a different cleanup policy from creating it inside `writePdf`.

Collecting PDF chunks into a `Buffer` is reasonable only when the maximum document fits comfortably in memory. Large output should keep flowing to a file, HTTP response, or object-store upload; wrapping a stream must not quietly create unbounded buffering.

The Promise is finished only when the source lifecycle you chose to represent is finished.
