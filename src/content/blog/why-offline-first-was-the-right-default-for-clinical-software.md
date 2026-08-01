---
title: 'Why Offline-First Was the Right Default for Clinical Software'
description: 'Why clinical software needs local durability, explicit authority, recovery, and honest limits—not a cache trick.'
date: 2026-07-24
updated: 2026-07-24
banner: /images/blog/historia-offline-first.png
bannerAlt: 'A battery lamp illuminating blank record cards beside a local workstation in a dark clinic'
---

A clinical record should not become unavailable because the router had a bad afternoon.

That sounds obvious. The web has trained us to treat it as an edge case anyway. Most applications are online systems with a few offline gestures added later: cache the shell, retry a request, show a reassuring cloud icon, and hope the connection returns before the person discovers which parts were never durable.

I did not want to build [Historia](https://historiamd.com), a Latin America-first electronic health record, that way.

Offline-first was not a PWA feature I wanted on a checklist. It was a product decision about who absorbs infrastructure failure. If a clinician is in an encounter and connectivity disappears, the software can either preserve the work and make the interruption boring, or make the clinician become its recovery mechanism. They can copy text into another app, repeat questions, reconstruct notes from memory, or wait while a patient sits in front of them.

That is an absurd place to put the failure.

Connectivity should expand what the software can do, not determine whether basic work survives.

Building around that idea forced me to stop thinking in terms of cached pages. Offline-first clinical software needs an explicit local authority, domain-specific conflict policy, honest limits, and tests that kill the browser at unpleasant moments.

# Offline is a normal operating state

“Works offline” often means an application can reopen a page it saw recently. That is useful, but it is not enough for clinical work.

A clinician needs to find the right patient, open the relevant context, continue an encounter, write on the Canvas, and trust that accepted work will survive a reload or renderer crash. Front-desk operations need schedules and patient demographics. Those are product behaviors, not document-cache behaviors.

The distinction changes the architecture.

An HTTP cache can preserve executable files. It cannot establish that a patient directory is complete, apply authorization changes coherently, isolate identities, or explain what happens when a local edit meets a newer server edit. Persisting a query cache is not much better. Query entries are projections shaped for screens, and their keys accidentally become authorization and synchronization policy.

I wanted one local model with one job: represent the authorized device view and durably accept the work the product explicitly supports offline.

Historia therefore keeps public pages server-rendered but treats the authenticated application as a client-rendered shell. After an online sign-in and preparation, a service worker can reopen that non-personalized shell and its assets. Authenticated routes read from a native IndexedDB replica whether the network is present or not. The query layer observes that replica; it is not the persistence layer.

That last boundary matters more than the choice of library. If screens sometimes read a server response and sometimes read local state, the application acquires two truths. Every route must then answer which one wins, how stale data appears, and whether an online response can overwrite pending local work. By making routes read the replica in both states, connectivity stops changing the application's basic data model.

Offline-first is easier to reason about when “online” is synchronization, not a separate execution mode.

# The server is canonical, but local acceptance is real

Local-first rhetoric sometimes slides into pretending the server no longer matters. That would be dishonest for Historia.

The canonical record still lives on the server. Shared workspaces, authorization, cross-device convergence, and actions with external or authoritative effects require it. But “canonical” must not mean that the browser holds disposable optimism.

When Historia accepts supported local work, it validates it, applies it to the encrypted replica, appends a durable command, and republishes the local projection before reporting success. The network is not in that acceptance path. Reopening the application should show the work because it was committed locally, not because a request happened to complete quickly.

Synchronization then turns durable intent into a canonical outcome. Commands have stable identities so retries are safe. The server applies a domain mutation and records its change-feed effect atomically. The client pulls bounded pages of server changes and reconciles them with pending work.

This is deliberately not “replay the failed HTTP request.” HTTP requests describe transport. They do not describe durable intent well enough to survive retries, schema evolution, authorization changes, or conflicts. `POST` happening twice is a networking problem. “Create this patient once, and tell me if that identity already exists” is a domain command.

The same reasoning is why I rejected a generic CRDT as the default answer. CRDTs are powerful when their merge semantics match the domain. Clinical software does not get safer because every concurrent value can be mechanically preserved. Some changes can coexist. Some require a clear authority. Some should stop and ask a person.

Historia's current conflict path makes same-field divergence visible and lets an authorized member resolve it. That is less magical than silently picking a winner. It is also more honest. A merge algorithm does not understand the clinical significance of two plausible demographic values merely because both arrived with timestamps.

# A complete snapshot must appear all at once

Initial preparation is another place where a cache-shaped design breaks down.

Suppose a device downloads half a patient directory and the connection dies. Showing those rows as if the device were prepared is worse than showing nothing. Absence has become ambiguous: does a patient not exist, or have they simply not arrived yet?

Historia prepares a fresh replica generation behind the visible one. The server issues a bounded snapshot lease and a change-feed watermark. Immutable-ID pages enter that hidden generation. Before exposing it, the client applies changes that happened after the watermark. One local transaction then makes the generation visible atomically.

An interruption can resume while its lease remains valid. If the lease expires or the cursor can no longer be used, staging is discarded and preparation restarts without destroying the last valid visible generation.

This is not glamorous architecture. It is what “available offline” has to mean when partial data can mislead somebody.

Authorization is part of the same protocol, not a filter sprinkled on top. Local data is partitioned by member, workspace, and authorization epoch. Different personas receive different projections. For example, an operations workflow can receive the demographics it needs without placing clinical record content in that local projection.

Product-visible local payloads are encrypted with a device-bound, non-extractable key. Encryption does not make browser storage invulnerable, and I would never market it that way. It narrows exposure and gives the replica an explicit security boundary. Identity transition, authorization change, device removal, browser storage policy, and local deletion still need first-class handling.

Security is not one cryptographic primitive. It is the set of states around it.

# Recovery is the feature

The easiest offline demo toggles airplane mode, edits one field, reconnects, and watches a green check appear. I care more about what happens when the renderer dies after the edit.

Historia's browser acceptance suite creates work offline, closes the browser context, reopens from the prepared profile while still offline, and verifies that the work remains. Another scenario writes to the encounter Canvas, waits for the durable save state, deliberately crashes Chromium's renderer, reopens the same encounter without a network, and checks that both the work and its patient association survived.

The suite also covers cold offline start, reconnect and conflict across two device profiles, and deferred work that must resume after connectivity returns.

Those tests exist because failure boundaries are part of the interface. “The state was in React” is not recovery. “The service worker probably retries” is not recovery. A useful contract says what was durably accepted, where it waits, what wakes synchronization, how retries remain idempotent, and what the person sees if the process stops halfway through.

This work has already caught a failure that toy fixtures hid. A production-shaped preparation run crossed D1's statement binding limit while loading a page of patient-related data, so preparation never completed. The fix was to bound those query chunks. The important result was not the patch. It was learning that a green test over a tiny workspace had been proving the wrong system.

That is why the offline performance fixture contains hundreds of patients and substantial associated history rather than three hand-written rows. The automated baseline records snapshot preparation, local query, and durable-create timings against explicit budgets. Those numbers are controlled Chromium regression evidence, not a claim about every device or network. Real release checks still need representative hardware, other browser engines, and shaped network conditions.

# Care work goes ahead of bulk transfer

Reconnect is not one queue draining from top to bottom.

An encounter can produce text, structured commands, audio segments, and files. If a large upload monopolizes synchronization while a small patient or Canvas command waits behind it, the implementation has optimized bytes instead of care.

Historia uses one foreground scheduler with explicit priority. Care and text work goes before bulk binaries. A newly queued high-priority item can run before the next binary even while bulk drain is active. Work is bounded per pass, retries are bounded, and interrupted items remain resumable.

The performance contract separates clinical convergence from full binary drain for the same reason. Requiring every file to finish before the application looks synchronized would make correctness depend on uplink bandwidth. Worse, it would encourage the scheduler to treat a large result attachment as more urgent than a small command that changes the active workflow.

The status indicator therefore cannot collapse reality into “online” or “offline.” A reachable network does not mean pending work has reached the server. Historia distinguishes disconnected state, synchronization in progress, pending work, conflicts, replica readiness, and capacity or storage trouble. Removing a device with pending work requires explicit confirmation because deleting local state can destroy the only durable copy of an unsynchronized action.

Reliability includes giving a person enough truth not to destroy their own recovery path.

# Some actions should remain online

Offline-first does not mean every button must work without connectivity.

Historia intentionally gates actions whose authority or dependency remains online. Finalizing a clinical record is one of them. Merge execution also needs the server, although a request can be recorded locally and run after reconnect. Live transcription cannot be promised while disconnected, but local audio can be retained for later processing. Billing, membership changes, shared template administration, and external prescription handoff remain online operations.

This is a better product than fake offline support that lets a person press a button and quietly leaves the action in limbo.

The rule I use is simple: offline work must be locally meaningful, durably representable, and safe to reconcile under a named domain policy. If an action needs current server authority, an external system, or a guarantee the browser cannot make, the interface should say so before the click.

That creates awkward edges. A clinician can continue drafting but cannot finalize until synchronization and connectivity return. The UI has to explain that without losing the draft or pretending the action succeeded. Product design has to carry the architectural truth.

The inverse is also true. Architecture has to carry the product promise. It is not enough for a modal to say “saved” if the content is sitting in memory waiting for a debounce timer.

# Browser support requires humility

The web platform does not offer identical guarantees everywhere.

Historia requires an initial online sign-in and completed replica preparation. [Persistent-storage requests](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) can reduce eviction risk, but browsers may decline them and people can clear site data. [WebKit documents](https://webkit.org/blog/14403/updates-to-storage-policy/) its own quota and eviction policies. An installed app may be preferable on iOS, but installation is not required.

[Background Sync is not broadly available](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API). Chromium may run it, but execution remains opportunistic. Power policy, lifecycle decisions, and browser heuristics can delay background work even where the API exists.

So Historia does not promise closed-app synchronization.

The promise is narrower and testable: accepted local work remains durable; interrupted synchronization can resume safely; and synchronization starts automatically on the next foreground open, focus, or reconnect. Background execution is a bonus, not a correctness dependency.

“Syncs automatically” implies control the browser does not give us. I would rather explain the real boundary than ship a comforting lie.

The automated end-to-end suite currently covers Chromium. The support matrix also includes Firefox, Safari, iOS/iPadOS, and Android, but those require release-time verification. A Chromium app-mode test is not proof of an operating-system PWA installation. Binary Playwright network toggles are not proof of performance on a lossy mobile connection. The architecture notes state those limits explicitly because tests should reduce uncertainty, not erase it rhetorically.

# Owning sync semantics was the smaller system

I evaluated external synchronization engines before choosing a custom replica and D1 change feed.

A mature engine can remove years of protocol work when its assumptions fit. In Historia's case, several strong options expected PostgreSQL replication, did not support D1 as a source, or would still leave the hard domain semantics to the application. Moving the backend solely to satisfy a sync product would not solve local encryption, persona-specific projection, offline identity, shell delivery, or clinical conflict policy.

That does not make custom sync generally superior. It means adopting an engine is not the same as outsourcing the problem.

Historia already used D1 as its canonical database. The chosen design adds one explicit protocol around that authority: atomic domain changes and feed entries, bounded snapshots, versioned local generations, durable commands, and domain conflicts. It is substantial machinery. The tradeoff is justified only because it keeps the difficult decisions visible and avoids adding another replicated authority with a different model.

The dangerous outcome would have been several partial mechanisms: persisted queries for reads, failed-request replay for writes, a special queue for encounters, and separate upload recovery for binaries. Each one looks smaller in isolation. Together they create four definitions of pending work and four recovery stories.

One deep offline seam is cheaper than a collection of convenient exceptions.

# The default changes what gets built

If offline support is scheduled after the online product is “done,” nearly every early decision works against it. Routes assume request availability. IDs come from server responses. forms equate success with HTTP completion. state lives in component memory. authorization is filtered at render time. uploads share no scheduler. conflicts are reduced to generic errors.

Retrofitting offline behavior then feels impossibly expensive because it is not one feature. It is a correction to the application's authority model.

Choosing offline-first as the default forced Historia to answer those questions while the system was still malleable. What does local success mean? Which projection may live on a device? What survives a crash? Which operations are idempotent? How does a stale device recover? When must a human resolve divergence? Which action should refuse to proceed?

Those questions improve the online product too. A locally durable Canvas is valuable when a tab crashes on excellent Wi-Fi. Idempotent commands help when a mobile connection drops after the server commits but before the response arrives. Atomic snapshots prevent partial preparation during deploys or interruptions. Explicit pending state is better than a spinner on any network.

Offline-first is a reliability architecture wearing a connectivity label.

Historia's implementation is still bounded by browser storage, initial preparation, server availability for authoritative actions, and the quality of its conflict policies. The tests demonstrate designed behavior in controlled environments; they do not establish clinical adoption, universal device support, regulatory compliance, or the absence of defects. Those limits do not change the default.

The network will come back. Trust is harder to restore.
