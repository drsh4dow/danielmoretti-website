---
title: 'Security Habits I Kept from Bug Bounty Work'
description: 'The security habits that still shape how I build software.'
date: 2024-02-08
updated: 2026-08-01
banner: /images/blog/security-habits-bug-bounty.png
bannerAlt: 'Sealed translucent envelopes crossed by blue inspection light and an amber thread'
---

Product engineering often begins with intent: we know what a feature should do, then follow the expected route. Security work begins outside-in, with observable behavior, and asks what the system can be made to do.

From 2019 to 2021, I worked as a bug bounty hunter on HackerOne, where I reported multiple valid vulnerabilities and built reconnaissance tooling in Bash; I will not name targets, reconstruct reports, or share exploit details.

The useful story is the posture that work left behind. I still begin by mapping what is reachable, then follow actor-controlled input until I can see where the software grants authority and what action actually completes.

When I meet an unfamiliar system, I want a rough map before I study one path deeply. Where does information enter? Where are decisions enforced? Which operations can change state or act with privilege?

The product’s navigation is only one view of that surface. A route described as internal may still consume a queue message, imported file, callback, provider response, or support action that another actor can influence. Reading only the intended interface makes those paths easy to miss.

My Bash tooling made reconnaissance repeatable. Instead of relying on memory and browser tabs, I could keep an inspectable surface map and revisit it. The tools did not prove vulnerabilities. They reduced accidental omissions and preserved attention for judgment.

I kept that habit in ordinary engineering. I trace routes into persistent stores, background work, and privileged operations, paying attention whenever data changes representation. A value may be decoded, normalized, resolved, and compared before use. A check against the raw input says little if a later interpretation determines the lookup or action.

That is also where authority becomes visible. I ask who chose a value and what the receiver may do because of it. A folder named `server`, a private repository, or a typed API does not decide what another actor may influence. The relevant check is the one that turns input into permission to read, write, invoke, or publish.

Locally reasonable pieces can become dangerous in combination. Consider a retry around an operation with a side effect. The transport may see a timeout and deliver the work again, while the destination completed the first attempt. Each component behaved as designed; together they repeated an action that was safe only once.

Calling retry a transport concern would end the review too early. I follow duplicate delivery to the destination and ask what evidence distinguishes “never happened” from “happened but acknowledgment was lost.” The answer may require idempotency or reconciliation. It cannot come from the queue alone.

This is why surface mapping and authority tracing belong together. The map shows that a path can be reached. Tracing shows what the actor can cause after each transformation and handoff. A route that looks harmless in isolation may feed a privileged lookup or activate a transformed file later. The consequential behavior lives across the join.

The clearest repair is often subtraction: remove an unnecessary route, narrow what an operation may do, or establish one meaningful representation instead of authorizing several interpretations.

A broad map is useful because it produces leads. It is not evidence that every lead is a vulnerability. Bug bounty work made that distinction difficult to avoid: plausibility without reproducible evidence was noise.

Enumeration and static analysis can point toward a claim. Proof has to fit the claim more closely: a minimal reproduction, a focused trace, or an observed state transition. Source can show an intended check while runtime behavior shows what was actually reachable. Neither should be stretched to answer a question it did not test.

Keeping discovery broad and proof narrow changes how I use tools. Reconnaissance may be noisy if its output remains a lead set. The next step is to reduce one lead to the smallest consequential behavior I can demonstrate. That discipline prevents a dashboard count or suspicious source pattern from becoming a conclusion by momentum.

It also protects me from familiarity with software I helped build. Intent encourages me to read implementation as confirmation of what I meant. Starting from the reachable surface and tracing authority through the completed action gives the system a chance to disagree.

The running system gets the last word.
