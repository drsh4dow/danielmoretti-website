---
title: 'Why My Godot Agent Feedback System Was Not a Bevy Port'
description: 'Moving agent feedback from a reusable Bevy plugin to a project-owned Godot skill changed the guarantees, ownership boundary, and evaluation strategy.'
date: 2026-08-01
updated: 2026-08-01
sequence: 70
banner: /images/blog/bevy-to-godot-agent-feedback.png
bannerAlt: 'The same low-poly game world through two windows beside a camera and controller'
---

An agent can write a plausible game without ever knowing whether the game works.

That is the ugly part of using coding agents on visual and interactive software. Source code gives them a rich stream of tokens. The running application gives them almost nothing. They can inspect a scene tree, follow a state transition, and produce a clean diff, then miss that the button sits off-screen, the character never receives the input, the animation advances too early, or the screenshot was taken before the renderer finished.

The missing capability is not more code generation. It is a feedback loop.

I built one for Bevy first. [`bevy-agent-feedback-plugin`](https://github.com/drsh4dow/bevy-agent-feedback-plugin) is a Rust crate, a JSON-lines protocol, clients, a runner, and a driving skill for Bevy applications. I later built [`godot-agent-feedback`](https://github.com/drsh4dow/godot-agent-feedback), a portable Pi skill with a project-resident Godot bridge, a small client, contract tests, windowed integration tests, and clean-environment driving evaluations.

Calling the second project a port would be wrong. The repositories share principles, but their public interfaces and ownership models are materially different. The Bevy implementation tries to provide a strong reusable instrumentation layer. The Godot implementation teaches an agent how to inspect a project, reuse or establish the smallest compatible bridge, and prove a task against runtime evidence.

I am not going to invent a personal conversion story that the repositories do not establish. The public history shows the Bevy repository beginning on July 5, 2026, and the Godot repository beginning on July 10. The Godot research explicitly records what to retain, adapt, simplify, and reject from the Bevy reference. It does not record some dramatic event that “made me leave Bevy,” and this is not an engine comparison. It is a comparison of two feedback systems and what their differences taught me.

# The loop has to close at runtime

The shortest useful loop is simple to describe:

1. establish what observable result means success;
2. launch the real application with feedback explicitly enabled;
3. inspect the initial runtime state;
4. inject the smallest meaningful input;
5. wait for a bounded semantic postcondition;
6. capture render-complete evidence;
7. inspect errors and decide whether the result actually passed.

Each step exists because a weaker shortcut lies nearby.

A listening socket does not mean the game is ready. An acknowledged input means the bridge dispatched an event, not that gameplay accepted it. A screenshot proves pixels were captured, not that the state behind those pixels is correct. A source-level assertion proves what the programmer expected, not what the process did. A sleep proves only that time passed.

The Bevy skill states the crucial distinction directly: transport readiness is not game readiness. Its clients can wait for registered state, resource, marker, predicate, or target conditions. After the condition is true, the agent can request a capture after a frame boundary. Capture metadata records both the request and completion frames, window information, PNG dimensions, and a `screenshot_captured` completion value. That proves Bevy completed screenshot readback and persisted the PNG. It does not pretend to prove what an operating-system compositor presented.

The Godot bridge preserves that epistemic discipline. Its capture command waits for `RenderingServer.frame_post_draw`, writes the PNG atomically, and returns its path, SHA-256, dimensions, and frame counters. A failed capture cannot return stale evidence. The driving skill still requires a semantic postcondition because render completion and gameplay correctness are different facts.

That distinction sounds fussy until an agent starts debugging from a stale screenshot. Then it becomes the whole product.

# Bevy made the instrumentation a reusable crate

The Bevy implementation is broad because a plugin can integrate deeply with the application runtime. A project adds `AgentFeedbackPlugin`, optionally adds `AgentFeedbackDiagnosticsPlugin`, and registers the application-specific facts an agent may observe: states, marker components, scalar resource fields, semantic targets, and predicates.

The generated discovery file advertises the selected loopback socket, heartbeat, capture directory, protocol version, supported commands, deterministic mode, capabilities, and live caps. The protocol supports primitive input, named target clicks, predicate waits, frame waits, normal-time waits, controlled time advancement, and screenshot capture. Rust, Python, and TypeScript clients expose that contract.

That produces a strong interface. An agent does not have to infer that a node named `PlayButton` is the only clickable object or scan arbitrary application memory. The application registers the facts it is willing to expose. Exact selectors, ambiguity failures, abort predicates, and bounded scans make absence and uncertainty visible instead of silently choosing the first plausible target.

Bevy also allowed a stronger time model. In deterministic mode, Bevy-managed virtual and fixed time freeze between `advance_time` requests. The implementation can advance a requested duration in bounded steps and reply only after the progression completes. This is useful for animation, cooldown, and transition testing where a wall-clock sleep is noisy.

The guarantee has edges, and the README names them. It does not control direct `Instant::now()`, OS or network clocks, unseeded randomness, or external state. Window dimensions can still be affected by the display server and window manager. “Deterministic” applies to the engine time under the plugin's control, not the universe around the process.

The repository also grew an orchestration layer. `bevy-feedback run` can prepare the application, launch it, wait for protocol discovery, run a driver, retain full logs, write a versioned run summary, enforce the actual logical window size, collect bounded failure evidence, and tear the process down. The runner deliberately does not own the display lifecycle; CI documentation uses an external virtual display.

This is a capable system. It is also a lot of surface area to own. There is a crate API, a wire protocol, a CLI, three client languages, skill copies that must remain byte-identical, diagnostic registration, deterministic timing, runner phases, release checks, and rendered tests. The scope buys reusable guarantees, but every guarantee becomes compatibility and release work.

# Godot moved the center of gravity into the skill

The Godot project changes the primary abstraction. Its `CONTEXT.md` explicitly says **driving skill**, not plugin or integration. The bridge is project-resident code. The agent first inspects the target project, then reuses a proven-compatible bridge or proposes the canonical bridge under `.godot_agent_feedback/`. It must not silently replace an unknown or locally modified implementation.

That makes ownership visible. A Bevy project opts into a published crate with a configured plugin. A Godot project owns the bridge files that become part of its runtime seam, while the portable skill owns the procedure for establishing and using them.

The canonical bridge is deliberately narrower. It speaks UTF-8 NDJSON over a random loopback port, accepts one client and one in-flight request, and implements handshake, input, release, capture, bounded waits, cooperative suspend/step/resume, probes, and shutdown. It does not reproduce the Bevy discovery file's full live schema and examples. Discovery carries compact identity, endpoint, capability, limit, and ownership information; the skill carries the protocol knowledge.

The bridge is inert unless two gates agree: the project setting enables it and the launch includes a fresh nonce. It rejects exported builds. Discovery is owner-only, the client must handshake the matching nonce, PID, and project identity, and clean shutdown removes the discovery file.

This is not a remote security boundary. The README is blunt that the random loopback endpoint is unauthenticated and accepts same-user local-process control risk. A nonce prevents accidental attachment and stale discovery confusion; it does not protect a compromised user account. That is the honest threat model for a local development tool.

The bridge package also uses a manifest of canonical file hashes. The skill may replace the complete canonical set only when the installed files still match their manifest. If the files diverged, it stops. This is less convenient than overwriting them, but preserving project-owned modifications matters more than pretending an installer understands them.

# What survived the change

The most important Bevy ideas survived because they are not engine features. Both systems require evidence from a launched application rather than treating code inspection as proof of visual behavior. Both also separate semantic proof from pixel evidence. Bevy exposes selected application facts through registered states, resource values, markers, predicates, and semantic targets. Godot uses a narrow project-specific probe when captures, counters, input, and logs cannot establish the result. A successful input request proves dispatch, not acceptance by the game; a completed screenshot proves capture, not gameplay correctness. The agent still has to wait for the stated consequence and use the kind of evidence that can establish it.

The lifecycle around that evidence remains bounded. Both systems cap work such as commands, waits, frame steps, captures, and retained artifacts, with the Godot host adding a process deadline. They also treat cleanup as part of a valid run: held inputs are released on disconnect, shutdown is bounded, discovery ownership is checked, and logs and transcripts survive failure. Coordinate spaces stay explicit—logical window and physical PNG coordinates in Bevy, normalized input paired with concrete capture dimensions in Godot—because a feedback run that hangs, leaves stale state behind, or clicks in the wrong space has not produced trustworthy evidence.

# What I deleted or refused to reproduce

The Godot research record is useful because it names rejection, not just inheritance.

I did not reproduce generic ECS inventory. Bevy's component model makes registered state, markers, resources, and semantic targets natural. Translating that into broad Godot scene-tree reflection would expand authority and compatibility cost. The Godot design uses fixed-group, read-only adaptive probes instead. A probe has a descriptor and a narrow sample. It cannot invoke arbitrary methods, evaluate expressions, or wander through every property in the scene.

I did not claim exact virtual-time control. Godot exposes pause, resume, and cooperative process or physics stepping, but the project research found no public exact whole-frame primitive equivalent to the Bevy arrangement. The result is called a **controlled run**, not deterministic mode. It can isolate a transition. It does not control clocks, random generators, threads, rendering servers, audio, networking, or external state, and it does not promise replay.

I did not maintain multi-language client parity. The Bevy repository has useful Rust, Python, and TypeScript clients, but every client duplicates protocol behavior, cleanup rules, capability validation, and release obligations. The Godot skill begins with one small bundled TypeScript client. More clients would be justified by demonstrated demand, not symmetry.

I did not force orchestration into every bridge. Bevy's CLI produces rich run summaries and owns prepare, game, driver, evidence, and teardown phases. Godot keeps the project bridge focused on runtime communication. The skill and evaluation supervisor own launch policy, transcripts, logs, screenshots, bounds, and retained artifacts.

I also rejected release checks built from sprawling version-string greps. The Godot package has one canonical manifest and validates generated artifacts and hashes around it. The goal is not fewer checks. It is to check a contract at its source instead of proving that duplicated text happens to agree today.

These are documented design rulings, not proof that one engine forced every decision. The engine APIs shape what is credible, but the change in product shape also reflects a narrower destination: a skill-first system for Pi driving Godot 4.7 scenes on Linux, not a universal engine automation layer.

# Evaluation became a product boundary

The Godot project adds something I now consider essential: clean-environment driving evaluations.

Unit tests can prove serialization, bounds, stale discovery handling, input release, and capture behavior. Windowed integration can prove that the bridge and renderer cooperate under Xvfb. Neither proves that a fresh coding agent can receive the skill, inspect an unfamiliar project, establish the bridge without damaging existing work, perform a task, gather valid evidence, and clean up.

The evaluation supervisor creates an isolated Git worktree, launches Pi under tmux, applies wall, token, and artifact limits, and independently grades task behavior, driving behavior, and repository integrity. It retains the prompt, transcript, diff, logs, screenshots, oracle results, and version manifest. Infrastructure failure is an invalid attempt, not a failed project task and certainly not a pass.

The repository's release procedure requires three consecutive valid unattended passes for each published scenario against a frozen commit and package. Any code, skill, fixture, prompt, dependency, model, or protocol change invalidates that certification candidate.

That is expensive and intentionally narrow. The published support matrix is Godot 4.7 stable, Linux desktop, windowed 2D and 3D runtime scenes, a pinned Pi/model configuration, and Bun for the client and harness. It does not claim support for exported games, editor UI automation, other agents, remote control, every platform, or deterministic replay.

The tradeoff is obvious. A narrow certified matrix gives me evidence I can inspect. A broad compatibility sentence gives me marketing copy.

An agent working on interactive software should not merely be able to change the program. It should be able to make a bounded claim about what the running program did, show the evidence, and state what the evidence does not prove.
