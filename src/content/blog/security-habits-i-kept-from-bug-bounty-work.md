---
title: 'Security Habits I Kept from Bug Bounty Work'
description: 'How bug bounty work shaped the way I map attack surfaces, question trust boundaries, limit authority, test failure paths, and demand evidence.'
date: 2024-02-08
updated: 2024-02-08
banner: /images/blog/security-habits-bug-bounty.png
bannerAlt: 'Sealed translucent envelopes crossed by blue inspection light and an amber thread'
---

From 2019 to 2021, I worked as a bug bounty hunter on HackerOne. I reported multiple valid vulnerabilities on live targets and built reconnaissance tooling in Bash. That is the public version, and it is the only version I am going to tell here.

I will not name targets, reconstruct reports, or turn someone else’s mistakes into a victory lap. The useful part of that work was never the story of one bug anyway. It was the change in posture.

Bug bounty work trained me to look at software from the outside in. Product engineering usually starts with intent. We know what the feature should do, so we follow the expected route through it. Security work starts with observable behavior and asks a less comfortable question: what can this system be made to do?

# Map authority

When I approach a system, I first want to know where information enters, where decisions are made, and which operations carry authority. That map starts with obvious interfaces such as HTTP endpoints, forms, uploads, command-line arguments, and database writes. It also includes the interfaces that disappear under the label of internal plumbing: queue messages, callbacks, redirects, imported files, provider responses, background jobs, configuration, support tools, and administrative actions.

The main user interface is not the whole product. A mature product may expose accumulated routes through compatibility code, integrations, migration paths, and operational tools. A feature can disappear from the navigation while remaining callable. I map what the running system accepts and permits rather than relying on the current product story.

Reconnaissance taught me to establish that rough surface before reasoning deeply about any single path. My Bash tooling made collection repeatable and kept the exposed surface from living in memory and browser tabs. That changed the work from “remember what I have already looked at” to maintaining an inspectable map I could revisit. The tooling did not prove a vulnerability or tell me which lead mattered. It reduced accidental omissions and left my attention available for judgment.

I now apply the same habit when reading an unfamiliar codebase. I inspect routes, process boundaries, persistent stores, background work, and privileged operations before following the happy path. The result is not a declaration that the system is secure. It is a list of places where the system changes meaning or grants power, which is where useful review begins.

Those places rarely align neatly with folders. A directory named `server`, a private repository, or a typed internal API is not itself a trust boundary. The boundary is the behavior that validates, constrains, translates, or rejects something another actor can influence. If a browser sends data to an API, an API sends work to a queue, or a provider response enters a parser, I want to see what the receiving side establishes rather than what the sending side promised.

That includes representation. A value may be decoded, trimmed, canonicalized, resolved, or compared differently as it moves. A check performed against the raw value may no longer describe the value used for a lookup or decision. I try to identify the representation on which authority depends, normalize it once where possible, validate that representation, and avoid downstream reinterpretation. A `string` can carry several incompatible meanings; a useful domain type begins only after the boundary has established one of them.

The same map shows whether authority is proportionate. I ask who chose a value, what the receiver can do because of it, and how long that power lasts. A component should receive the least authority needed for its present responsibility, not an application-wide context or broad credential for convenience. Narrow capabilities make misuse harder and clarify the component’s job.

Permissions can become so granular that maintaining them creates a second system. I want the smallest boundary that is explicit, reviewable, and sustainable, not ceremonial restriction. The test is whether I can point to where authority is granted and an invalid request is stopped.

# Attack compositions

A feature can be reasonable alone and dangerous in combination. That possibility changed how I review software more than any habit of staring harder at isolated functions.

A redirect may feed another parser. A user-controlled identifier may cross into a privileged lookup. A retry may repeat a side effect. A file accepted under one set of assumptions may later be rendered under another. An administrative tool may expose an action that the public product carefully restricts. None of the pieces has to look obviously broken in its own implementation. The unexpected behavior exists in the joins.

I therefore trace complete actions across components. When one service calls another, I ask whether the caller needs every operation the callee makes available. When work moves onto a queue, I ask what duplicate delivery means at the destination rather than treating retry as a transport detail. When an adapter converts one asynchronous interface into another, I check whether error, cancellation, and settlement rules survived. When an import pipeline accepts data for later use, I follow the transformed representation to the place where it becomes active.

This is also why normalization belongs to the composition review rather than to a generic input-validation checklist. Each layer can make a locally reasonable transformation and still produce a globally inconsistent decision. The router and database may disagree about equivalent identifiers. A parser and renderer may assign different meaning to the same data. Validation before one transformation cannot automatically authorize every later interpretation. I want the security decision as close as possible to the representation and operation it governs.

Composition review tests assumptions no single module owns. Can one actor supply the output consumed by the next step? Does the second step inherit more trust than the first established? Does combining two actions grant a capability neither was meant to provide?

I find this review most useful before discussing clever mitigations. If the composition grants unnecessary authority, the strongest fix may be to remove that path or narrow the receiving operation. If the same data is interpreted repeatedly, establishing one representation can remove disagreement. If retry makes an action ambiguous, the product needs an idempotency or reconciliation rule, not another optimistic comment. A smaller reachable system is easier to secure because there are fewer meaningful combinations to reason about.

# Treat failure and cleanup as one lifecycle

The happy path is exercised by demos, routine use, and product reviews. The rest of the lifecycle appears during timeouts, partial writes, duplicate deliveries, cancellations, malformed responses, disconnects, and interrupted processes. Those states are not a separate reliability topic. They determine whether authority, resources, and sensitive data outlive the operation that justified them.

I ask who owns every resource created along the path and what happens when control stops early. If a request is cancelled, does an external side effect continue? If a credential is revoked, which cached copy still works? If a session ends, which related processes or leases survive? If data is removed, which derivative or temporary stores retain it? If a resource is replaced, who closes the old one?

Creation and cleanup need one contract because stale authority is still authority. A cancellation path that returns control to the user while work continues elsewhere is not merely untidy; it changes what the user can truthfully assume. A caught exception does not finish the failure path if state remains ambiguous. I want to know what stopped, what may have completed, what can safely be retried, and which state is authoritative.

Explicit ownership helps. The code that creates a resource should make clear who closes it, but ownership does not always mean cleanup occurs in the same function. Work may cross a process or service boundary. In that case the handoff itself must establish who now owns termination, expiry, or compensation. Without that transfer, each component can assume the other will clean up while the resource remains live.

Diagnostics are part of this lifecycle. Recovery requires evidence, but collecting every available value creates another exposed surface. Logs can retain tokens, personal data, request bodies, provider output, and internal identifiers long after the original operation. Debugging interfaces can quietly become the broadest read path in a product. An error can reveal internals to the wrong audience while still giving the operator no useful account of the failure.

I design evidence around the decision someone must make after failure. A useful record identifies the operation, relevant state transition, and failure category without dumping everything in reach. User-facing output explains what the user can do next without exposing machinery. Operator-facing diagnostics connect the failure to an inspectable event. Retention is bounded, and sensitive values are omitted or redacted before they spread through several sinks.

Structured evidence usually requires less indiscriminate collection and makes ambiguity visible. If the only diagnostic is a raw payload, the system has not named its state or the rule that failed. A trace of a transition and outcome can support investigation without exposing every piece of data involved.

I test interruption with the same seriousness as success. Cleanup that runs only at the bottom of a completed path is not enough. Cancellation, timeout, and partial completion need observable outcomes. The goal is not to claim that no work or state can ever be lost. The goal is a bounded lifecycle whose remaining uncertainty is explicit enough to support a safe next action.

# Separate reconnaissance from proof

Discovery produces leads. It does not produce conclusions.

Automation can enumerate surface, expose repeated patterns, and highlight anomalies. Static analysis can flag a suspicious flow. A dashboard can show correlation. None of those artifacts proves a vulnerability, a root cause, or a security property by itself. Reconnaissance tells me where to spend attention; proof tells me what claim the evidence supports.

Bug bounty work made that distinction unavoidable. A plausible explanation without reproducible evidence was noise, however convincing it sounded. In product engineering I apply the same standard to tests, traces, source inspection, and incident diagnosis. A test passing once does not prove a lifecycle guarantee. A metric changing does not identify the cause. A generated explanation does not establish that the running code behaves as described.

I want every consequential claim connected to something inspectable: a minimal reproduction, a request and response, a source location, a trace, a state transition, or a test that exercises the relevant boundary. Different claims need different evidence. Source code can show intended checks; a runtime observation can show which route was reachable; a focused test can preserve a behavior after the immediate investigation ends. No single artifact should be made to prove more than it can.

Keeping reconnaissance separate also makes tools easier to trust. An enumerator can be broad and noisy if its output is treated as a lead set. A proof must be narrower because it carries a stronger claim. Confusing the two encourages either false confidence in automation or an impossible demand that discovery tooling eliminate every false positive. I prefer to preserve the handoff: first identify a candidate boundary, then reproduce the behavior, then explain the smallest claim the evidence warrants.

That discipline protects against my own familiarity with a system. When I wrote or reviewed the intended behavior, it is easy to read the implementation as confirmation. Starting from observation forces me to account for reachable states, transformations, and enforcement. Evidence can contradict the story without needing permission from it.

The lasting lesson is that implementation intent is not runtime behavior.

I now finish a review by tracing each product boundary from actor-controlled input to the concrete operation and evidence that show what the running system permits.
