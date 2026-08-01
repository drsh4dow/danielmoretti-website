---
title: 'What a Small Rust SDK Should Make Boring'
description: 'What a small Rust SDK should hide—and what it should leave visible.'
date: 2026-04-30
updated: 2026-08-01
banner: /images/blog/qstash-rust-sdk.png
bannerAlt: 'A small paper parcel waiting in a row of dark delivery slots'
---

An SDK has failed when using the SDK becomes the interesting part of the work.

Application code should not need to remember whether an option belongs in a path, query string, JSON body, or vendor-prefixed header. Request handlers should not rebuild JWT verification from a checklist. And transport failure, API rejection, and an unexpected response shape should never collapse into one vague error.

That is how I judge [qstash-rs](https://github.com/drsh4dow/qstash-rs), a small Rust SDK for [Upstash QStash](https://upstash.com/docs/qstash). Wrapping HTTP is easy. The useful work is owning protocol knowledge that every caller would otherwise have to learn, repeat, and eventually get wrong.

QStash accepts a message and delivers it to a URL or URL Group, but much of its delivery configuration lives in HTTP headers. qstash-rs turns that grammar into a `Destination` and a `PublishRequest` builder. A caller can write `retries(3)` rather than remember the capitalization and encoding of a vendor header. The builder translates that choice to the wire, while malformed URLs and invalid headers fail before transport.

This is more than fewer keystrokes. Application code describes the operation while one place owns QStash’s representation of it.

The distinction matters most around retries. qstash-rs does not retry publication behind the caller’s back; it sends retry configuration to QStash. [Upstash documents](https://upstash.com/docs/qstash/features/retry) how the service retries delivery after a non-2XX response. Those are delivery attempts by QStash, not a hidden client loop. After an ambiguous transport failure, silently publishing again could create another message unless the application had designed for idempotency.

Publishing is only half the job. [QStash signs inbound requests](https://upstash.com/docs/qstash/howto/signature) with a JWT in `Upstash-Signature`. Complete verification checks that signature against the current or next rotation key, validates the token, compares its subject with the destination URL, and matches its body claim against the SHA-256 hash of the exact raw request bytes.

`Receiver::verify` keeps that work together. The body input is `&[u8]` because parsing and reserializing JSON can change whitespace or key order. Equivalent data is not equivalent cryptographic evidence. Both signing keys are accepted because [Upstash’s rotation API](https://upstash.com/docs/qstash/api-reference/signing-keys/rotate-signing-keys) promotes the next key to current and creates a replacement.

The API permits callers to omit the destination URL, but doing so is weaker verification, not another complete form of it. Without checking `sub`, a valid QStash token intended for another destination using the same signing key could be replayed here. Callers that have the request URL should provide it and require the match.

A wrapper that turns every failure into “request failed” has hidden the only information needed to respond correctly. qstash-rs keeps invalid configuration separate from transport failure and a non-success QStash response. It also distinguishes a successful HTTP response whose body cannot be decoded, because that can indicate a compatibility problem rather than service rejection.

The retained detail matters. An API error keeps its status and service response where available. A decode error keeps the response body and JSON source error. Verification reports subject and body mismatches rather than flattening them into a generic JWT failure. A bad local URL needs a code change; a connection failure may be transient; a 401 came from the service; a 200 with an unknown shape means the assumptions in the client deserve inspection.

This is where the wrapper should stop. Delivery execution, retry timing, and service-side guarantees still belong to QStash; application idempotency and the decision to publish again still belong to the caller. Hiding either would make the API look simpler by making its behavior harder to reason about.

A small SDK should make expensive mistakes dull: translate the wire format, shape requests, verify inbound evidence in one operation, and keep failures recognizable. Then it should stop. The best wrapper leaves application code thinking about the message, not the envelope.
