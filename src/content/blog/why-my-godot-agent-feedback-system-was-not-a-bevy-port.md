---
title: 'Why My Godot Agent Feedback System Was Not a Bevy Port'
description: 'Why the feedback loop changed when I moved it from Bevy to Godot.'
date: 2026-07-16
updated: 2026-08-01
banner: /images/blog/bevy-to-godot-agent-feedback.png
bannerAlt: 'The same low-poly game world through two windows beside a camera and controller'
---

An agent can write a convincing game and still have no idea whether it works.

Code gives the agent plenty to inspect. A running game does not. It can follow the scene tree, produce a tidy diff, and miss that the button is off-screen, input never reaches the character, or the screenshot arrived before rendering finished. The missing piece is not better generation. It is a feedback loop with honest evidence.

I built that loop for Bevy first. [`bevy-agent-feedback-plugin`](https://github.com/drsh4dow/bevy-agent-feedback-plugin) puts its guarantees in a reusable Rust plugin. I later built [`godot-agent-feedback`](https://github.com/drsh4dow/godot-agent-feedback), where the driving skill and a project-owned Godot bridge carry more of the work. The second project is not a port. The useful comparison is how that change in ownership altered the design.

# Runtime evidence, not plausible code

A useful run launches the real application with feedback enabled, inspects its initial state, injects a small input, waits for a bounded semantic result, captures a completed frame, and checks errors. Every shortcut in that sequence can produce false confidence.

A socket accepting connections does not mean the game is ready. An input acknowledgement proves dispatch, not that gameplay accepted the event. Sleeping proves time passed, not that a transition completed. Source inspection shows what the code appears designed to do, not what the process did.

A screenshot has a similar limit: it proves captured pixels, not the state that caused them. In Godot, capture waits for `RenderingServer.frame_post_draw`, writes the PNG atomically, and reports its path, SHA-256, dimensions, and frame counters. Yet the driving skill still requires a semantic postcondition. If an agent clicks Start, it should establish that the game entered the expected state as well as capture the resulting frame. Pixel proof and semantic proof answer different questions.

Bevy follows the same principle. Its clients can wait for registered application facts, while screenshot metadata records completion details. Its deterministic mode freezes Bevy-managed virtual and fixed time between explicit advances. These facilities fit a reusable plugin because the application registers what the plugin may observe and the plugin presents a stable interface to clients.

Godot kept the demand for launched-runtime evidence but changed three concrete design choices.

The Godot agent inspects the target project, then reuses a compatible bridge or proposes the canonical bridge under `.godot_agent_feedback/`. It may not overwrite an unknown or locally modified installation. A manifest of canonical hashes permits replacement only while the complete installed set still matches.

That makes ownership visible. The bridge stays with the project, while the portable skill carries the procedure for installing, launching, driving, and collecting evidence. This is less symmetrical than the Bevy crate and its clients, but it avoids pretending that arbitrary Godot projects expose one generic application model.

The split also keeps the runtime code narrow. The bridge handles communication with the launched game; the skill decides how to prepare the project and preserve the resulting logs, screenshots, and transcript. Adding a second client language or moving supervision into every project would create more compatibility work without improving the evidence from one run.

The bridge remains inert unless a project setting and fresh launch nonce enable it, and it rejects exported builds. Discovery is owner-only; the handshake checks nonce, PID, and project identity. None of this turns loopback into a remote security interface: an unauthenticated endpoint still accepts the risk of another process running as the same user.

I did not recreate generic ECS inspection as broad scene-tree reflection. Godot uses narrow, read-only, fixed-group probes when captures, counters, input, and logs are insufficient. A probe exposes a descriptor and sample. It cannot call arbitrary methods, evaluate expressions, or wander through every property.

That restriction asks the project to name the fact an agent actually needs. A health value or current phase can become observable without exposing the whole running scene as an accidental automation API. It also makes the semantic check easier to understand: the probe was added for a specific claim, rather than discovered through unrestricted inspection.

Godot can pause, resume, and cooperatively step processing or physics. That is enough to make many interactions easier to inspect, but the research found no public exact whole-frame primitive equivalent to the Bevy arrangement. Calling the result deterministic would hide what remains uncontrolled.

So the Godot system promises a controlled run instead. Rendering, clocks, randomness, threads, networking, and external state can still affect the outcome. The practical response is to wait for a bounded semantic condition and preserve evidence from the run, not infer certainty from a fixed sleep or a requested number of steps.

Clean-environment evaluations tested whether an unfamiliar agent could install the bridge safely, drive the game, retain evidence, and clean up without damaging the project. Those results remain limited to the tested Godot 4.7 stable and Linux desktop setup; they do not extend the claim to exported games, other platforms, other agents, or deterministic replay.

An agent should not merely change an interactive program. It should say what the launched program did, show why it believes that, and leave the edge of its knowledge in plain sight.
