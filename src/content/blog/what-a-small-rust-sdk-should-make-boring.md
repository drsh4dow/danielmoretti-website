---
title: 'What a Small Rust SDK Should Make Boring'
description: 'qstash-rs as a case study in protocol translation, inbound verification, useful errors, and explicit scope.'
date: 2026-04-30
updated: 2026-04-30
banner: /images/blog/qstash-rust-sdk.png
bannerAlt: 'A small paper parcel waiting in a row of dark delivery slots'
---

An SDK has failed when the interesting part of using it is the SDK.

I do not want application code to remember which configuration belongs in a JSON body, which belongs in a query string, and which must become a specially prefixed HTTP header. I do not want every request handler to reconstruct JWT verification from a checklist. I definitely do not want a transport failure, an API rejection, and a response-shape mismatch flattened into the same useless error.

That is the standard I use when I look at [qstash-rs](https://github.com/drsh4dow/qstash-rs), a small Rust SDK for [Upstash QStash](https://upstash.com/docs/qstash). The project is not interesting because it wraps HTTP. Any application can wrap HTTP. It is interesting as a concrete test of where a small SDK should put its boundary.

The answer is not “around every endpoint.” A good boundary sits around the protocol knowledge callers should not have to carry.

# Hide protocol trivia, not service behavior

QStash accepts a message and delivers it to a URL or URL Group. Its REST API encodes a surprising amount of delivery configuration in headers. The destination lives in the request path. A custom destination header needs an `Upstash-Forward-` prefix. Delivery method, delay, retry count, retry-delay expression, callbacks, timeout, labels, deduplication, and redaction each have their own wire representation.

That is exactly the kind of work an SDK should make boring.

In qstash-rs, a caller starts with a `Destination` and a `PublishRequest` builder. A URL destination is parsed up front. A URL Group is represented separately. JSON serialization sets `Content-Type: application/json`. A normal custom header is translated into the forwarding form QStash expects, while content type and existing `Upstash-*` headers are left alone. Seconds become values such as `30s`; retry counts become `Upstash-Retries`; a retry expression becomes `Upstash-Retry-Delay`.

This is deeper than saving keystrokes. The builder gives application code the language of the operation while one implementation owns the wire grammar. The caller says `retries(3)`, not “please remember the exact capitalization and string encoding of this vendor header.” It says `Destination::url(...)`, and malformed URLs fail before an HTTP request is attempted.

The distinction matters because the SDK does **not** perform those delivery retries. It only sends the configuration to QStash. [Upstash documents the service behavior](https://upstash.com/docs/qstash/features/retry): a delivery that does not return a 2XX response is retried, the default is three retries, the total attempts are the initial delivery plus those retries, and the service applies its backoff or the supplied retry-delay expression. The crate's `retries` and `retry_delay` methods are typed controls for that service behavior. They are not a client-side retry loop around the publish API.

That separation should remain visible. If an SDK silently retried publishing, it could create a second message after an ambiguous transport failure unless idempotency had been designed deliberately. qstash-rs has no hidden publish retry machinery. The repository supports no claim that it guarantees exactly-once publication or delivery. It translates a request and reports the result.

# Types should remove invalid interpretations

Rust SDKs often advertise type safety while accepting a bag of strings for everything that matters. That catches spelling mistakes in field names and little else.

qstash-rs makes a more useful choice at the request seam. A destination is either a parsed `Url` or a URL Group name. Delivery methods use `reqwest::Method`. Bodies are bytes, with a fallible JSON helper for serializable values. Forwarded headers go through `HeaderName` and `HeaderValue`, so invalid HTTP header syntax becomes an `InvalidRequest` before transport. Batch requests reuse the same publish request and add an optional queue name instead of inventing a second configuration model.

The crate does not pretend every vendor value has a rich local type. Cron expressions and retry-delay expressions remain strings. Callback values remain strings. That is a tradeoff, but an honest one. Locally parsing Upstash's expression language would add another grammar that could drift from the service. A type only earns its place when it eliminates a meaningful ambiguity without creating a shadow specification.

The same restraint appears in response handling. Publishing to one URL returns one shape while publishing to a URL Group can return multiple items. The public method normalizes both into a list of `PublishedMessage` values. Callers do not need a branch based on the destination just to iterate over results.

That normalization is valuable because it removes protocol variation without concealing outcome data. Each item can still expose its message ID, URL, deduplication flag, or error when present. The boundary is deep where it should be and transparent where the application still needs judgment.

# Verification belongs inside the boundary

Publishing is only half of a queueing SDK. Receiving a request safely is where casual wrappers become dangerous.

[QStash signs inbound requests](https://upstash.com/docs/qstash/howto/signature) with a JWT in the `Upstash-Signature` header. Upstash's verification procedure requires more than checking that a token decodes. The signature must be valid; the issuer must be `Upstash`; expiry and not-before claims must hold; the subject can be checked against the destination URL; and the SHA-256 hash in the `body` claim must match the exact raw request body.

qstash-rs puts that procedure behind `Receiver::verify`. The receiver holds both current and next signing keys, tries the current key and then the next, validates HS256 and the issuer, applies an explicit clock tolerance, optionally checks the URL against `sub`, and compares the body claim with a URL-safe Base64 encoding of the raw-body SHA-256 digest.

The two keys are not decorative. [Upstash's rotation API](https://upstash.com/docs/qstash/api-reference/signing-keys/rotate-signing-keys) promotes the next key to current and generates a new next key. Accepting both lets applications update keys without making rotation an instant verification outage.

The raw-body requirement is equally important. Parsing JSON and serializing it again can change insignificant whitespace or key ordering while preserving the data. Cryptographic verification does not care that the data is semantically equivalent. It cares that the bytes match. The crate's `VerifyRequest` accepts `&[u8]`, making the correct input difficult to misunderstand.

This is what a security boundary should do. It should not offer seven low-level helpers and ask every framework integration to assemble them correctly. It should accept the evidence available in a request handler and return success or a specific failure.

The repository tests current-key verification, fallback to the next key, and body mismatch. Those tests establish the implementation's intended behavior. They do not prove compatibility with every token QStash will ever issue. The opt-in live tests currently smoke-test signing-key retrieval and log listing, not end-to-end inbound delivery and verification. That limit is worth saying plainly.

# Errors are part of the SDK's public model

A request can fail before the network, during transport, at the QStash API, or after a successful HTTP status when the response cannot be decoded. Those are different operational facts.

qstash-rs preserves them in its public `Error` enum. Invalid client configuration is distinct from an invalid request. Transport errors retain the underlying `reqwest` error. Serialization errors retain `serde_json`'s source. A non-success QStash response records the HTTP status, a best-effort service message, and the raw response body when available. A successful response with an unexpected shape becomes `Decode`, including the status, body, and JSON error. JWT-library failures and post-verification subject or body mismatches are separate again.

That is not elaborate error architecture. It is the minimum useful account of where reality diverged from the caller's expectation.

Flattening these cases into `PublishError` would force debugging back into logs and guesswork. Keeping them distinct lets an application decide what is actionable. Bad configuration should be fixed. A 401 is not a malformed response. A 500 from QStash is not the same as failing to connect. A 200 containing a shape the SDK does not understand is a compatibility signal, not success.

The HTTP layer also avoids claiming more than it knows. It extracts an `error` field when one exists, otherwise retains the raw body, otherwise falls back to the status text. It preserves evidence without manufacturing certainty.

# Small scope is a feature only when it is explicit

The current README names the crate's focus: publish and batch publish, message cancellation, logs, DLQ operations, queues and enqueue, schedules, URL Groups, signing keys, and inbound verification. It also names exclusions: flow-control management endpoints and product-specific convenience integrations are out of scope for now.

This is not complete coverage of everything QStash can do, and the repository does not claim it is. `Cargo.toml` reports version `0.6.0`, while the canonical Git history currently visible on `main` preserves one April 21, 2026 redesign commit and no tags or GitHub releases. That is enough to discuss the current contract, not invent a release narrative.

The license is MIT. The deterministic suite uses a mock HTTP server to assert paths, headers, query parameters, bodies, normalization, lifecycle calls, and error behavior. Optional live smoke tests require an explicit environment flag. Those tests establish intended protocol behavior; they do not establish production adoption, performance, completeness, or compatibility with every future service response.

A small SDK earns its keep by making a narrow set of expensive mistakes harder to make. It owns authentication setup. It owns endpoint and header translation. It gives requests domain-shaped types. It verifies inbound evidence as one operation. It preserves failure information. Then it stops before convenience methods become a second product layered over the first.
