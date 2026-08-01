---
title: 'Why Offline-First Was the Right Default for Clinical Software'
description: 'What offline-first really demands from clinical software.'
date: 2026-07-24
updated: 2026-08-01
banner: /images/blog/historia-offline-first.png
bannerAlt: 'A battery lamp illuminating blank record cards beside a local workstation in a dark clinic'
---

A clinical record should not disappear because the router had a bad afternoon.

That was the starting point for [Historia](https://historiamd.com), a Latin America-first electronic health record. Not “could we add an offline mode?” but “who deals with the failure when connectivity drops?” If the answer is the clinician—copying notes elsewhere, repeating questions, reconstructing an encounter from memory—then the software has passed its problem to the worst possible person at the worst possible moment.

So I made offline the normal state. Connectivity adds capabilities and carries work to the server, but basic supported work does not depend on a request succeeding. That choice sounds simple. In practice, it determines where truth lives, what “saved” means, and whether a half-finished download can masquerade as a complete patient directory.

# Local work has to be real

A cached application shell is useful, but it is not an offline clinical system. A clinician must be able to find a patient, open the relevant context, continue an encounter, write on the Canvas, reload, and still see accepted work. Front-desk staff need their schedules and demographics. Those are domain behaviors, not caching tricks.

After an online sign-in and preparation, Historia can reopen its application shell and read authenticated routes from a native IndexedDB replica. The application therefore has one reading model rather than an online truth and an offline approximation.

When supported local work is accepted, Historia validates it, applies it to the encrypted replica, appends a durable domain command, and republishes the local projection before showing success. The network is not hiding in that path. If the renderer crashes after acceptance, the work should come back. A command such as “create this patient once” also survives retries more honestly than a recorded failed HTTP request.

The server remains canonical for shared convergence, authorization, and actions with authoritative or external effects. Synchronization carries durable local intent there, where stable command identities make retries safe. The server records a mutation and its change-feed effect atomically; the client can then reconcile returned changes with work still pending locally. This does not make every conflict automatic: some changes can coexist, while a same-field clinical divergence may need an authorized person to decide.

Preparation has the same requirement for honest state. If a connection dies halfway through downloading a patient directory, the device must not present the partial result as complete. Historia builds a fresh replica generation behind the visible one, downloads a bounded snapshot, and applies later changes there. One local transaction reveals the generation only when it is complete.

An interrupted preparation can resume while its snapshot remains valid. Otherwise staging is discarded and restarted while the last valid generation stays visible. The device never merges a half-loaded replacement into the replica a clinician is searching. Absence then means absence within a complete authorized projection, not “perhaps that record was on the next page.”

Each user receives only the projection their role permits. An operations workflow can receive required demographics without receiving clinical record content, and product-visible payloads are encrypted with a device-bound, non-extractable key. That narrows exposure; it does not make browser storage invulnerable or turn a stale authorization into a safe one. Identity, authorization, and device removal still have to invalidate access rather than trusting yesterday's local state.

# Recovery matters more than the demo

The easy demo is airplane mode, one edit, reconnect, green check. I care more about killing Chromium after the edit.

Historia's browser suite writes to the encounter Canvas, waits for durable save, deliberately crashes the renderer, then reopens the encounter without a network. The test verifies both the content and its patient association. This is a harsher test than toggling airplane mode while the page remains alive: it removes the memory that can accidentally make a weak implementation look durable. Once the interface says the work is accepted, React state, a live renderer, and a working router are no longer keeping it alive.

Reconnect creates a less theatrical failure. An encounter can produce both tiny clinical commands and large files. If the queue drains a large upload before saving a Canvas command, “syncing” can leave important work starved behind bulk data. Historia gives care and text work priority between resumable upload chunks, so a newly accepted command can proceed while the bulk transfer continues.

The interface cannot reduce that to an online dot. It shows when work is pending and warns before someone removes a device whose local copy may be the only durable one. Reliability includes telling someone when an action would erase the recovery path they are relying on.

# Offline-first has honest edges

Some actions should refuse to work offline. Historia keeps finalization of a clinical record online because it requires current server authority. A clinician can keep drafting while disconnected, but cannot finalize. That is awkward and truthful. Fake success followed by limbo is worse.

My rule is that offline work must be locally meaningful, durably representable, and safe to reconcile under a named domain policy. If it needs current server authority, an external system, or a guarantee the browser cannot provide, the interface says so before the click.

Browsers impose another limit. Historia requires an initial online sign-in and completed preparation. [Persistent-storage requests](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) reduce eviction risk, but a browser may decline and a person may clear site data. [WebKit has its own quota and eviction policies](https://webkit.org/blog/14403/updates-to-storage-policy/). Encryption limits what stored payloads expose; it cannot prevent the browser or user from deleting them.

[Background Sync is not broadly available](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API), and even Chromium runs it opportunistically. Historia therefore does not promise closed-app synchronization. It promises that accepted local work remains durable, interrupted sync can resume safely, and opening or refocusing the application while connected starts it again. Background execution is a bonus, never a correctness dependency.

Offline-first does not remove the server. It keeps a routine network failure from erasing accepted clinical work.

The network will come back. A clinician's lost trust may not.
