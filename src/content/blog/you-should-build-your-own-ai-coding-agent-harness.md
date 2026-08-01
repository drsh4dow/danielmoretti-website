---
title: 'You Should Build Your Own AI Coding Agent Harness'
description: 'Why the model matters less than the workflow around it.'
date: 2026-08-01
updated: 2026-08-01
banner: /images/blog/ai-coding-agent-harness.png
bannerAlt: 'Hand-woven blue and slate ribbons cradling a small amber core'
---

I do not want my engineering workflow held hostage by whatever the fuck Anthropic or OpenAI decided was good this month. Models will change. My standards should not change with them.

That is why I built [my own harness around Pi](https://github.com/drsh4dow/pi-setup). The model is replaceable; the harness is where my engineering intent lives.

An agent that can run longer or recruit more agents can produce more code. It can also produce a much larger mess before anyone notices. I care less about generated volume than about what remains afterward. Did the change remove a concept? Collapse a path? Leave less machinery for the next engineer? Code is a liability before it becomes an asset, no matter who typed it.

## Own the operating layer

Building a harness does not mean writing an inference server, terminal emulator, sandbox, and agent loop from scratch. Pick a runtime you can shape, then own the layer that tells it how you work.

For me, that runtime is [Pi](https://github.com/earendil-works/pi), a small programmable core closer to Neovim than a sealed product. My setup uses prompts to explain how an agent should investigate, change, and verify work. Code controls the dangerous parts: which tools a child receives, how long it may execute, and what happens to processes it starts.

That distinction matters because prompts influence behavior but do not enforce it. A child prompt says a delegate cannot create another delegate; the runtime removes the delegation tools. It says the child cannot ask the user; no question tool is available. If a failure could lose work, leak a process, burn unbounded resources, poison context, or prevent recovery, polite instructions are not enough.

This is the part I want under my control when a model changes. I can revise an instruction when a model interprets it poorly, but the important constraints should not depend on interpretation at all. The harness decides what an agent is allowed to do and retains the evidence I need when it stops. A model upgrade then changes the reasoning inside the workflow rather than quietly replacing the workflow itself.

The operating layer begins with collaboration. Before an agent moves freely, I decide what problem exists, which tradeoff is acceptable, what failures are tolerable, and what may be disclosed. The agent should inspect facts it can find rather than asking me to recite them, but it cannot decide what I value or what readers and users should believe. Small, obvious fixes need little ceremony. Ambiguous work needs those judgments settled before autonomy becomes useful.

I spend freely on reasoning, then try to leave the smallest complete change. This is not code golf, and a negative diff is not automatically good. Necessary tests and explicit failure paths cost lines for a reason. The target is fewer concepts, states, paths, and ownership burdens. One painful delegation redesign made that concrete.

## What a runaway child taught me

Delegation protects the parent's context. A child can investigate a noisy subsystem or review a diff, then return the conclusion instead of every dead end. My delegate tool gives each child a fresh in-memory Pi session and a self-contained brief. The parent can inspect, steer, wait, or cancel it.

Early children kept working long after their effort had value. They explored and iterated while time and tokens disappeared. My first fix was more machinery. The [hard-limit change](https://github.com/drsh4dow/pi-setup/commit/39da9a59) added 310 lines and removed 10, assigning different time and token budgets to `fast` and `thorough` work. Then I added a budget-aware prompt that asked children to converge before expiry.

It was the wrong interface. Effort was supposed to select reasoning depth, but secretly determined lifespan too. A useful task labeled `fast` could be killed early. More timeout options would only make the confusion configurable.

The bug was in the concept, not the values. Tuning the fast budget upward would preserve two meanings behind one setting. Adding a third effort level would create another lifespan to explain and test. The only clean fix was to separate the question the caller actually asked—how deeply should this child reason—from the runtime's responsibility to stop any child eventually.

I replaced the scheme with one execution ceiling for every child. Effort now means reasoning depth and nothing else. The [redesign](https://github.com/drsh4dow/pi-setup/commit/6b3762be) added 86 lines and deleted 483. Per-effort budgets, stage deadlines, convergence warnings, and tests for promises the interface should never have made all disappeared. The deletion was evidence that the meaning of the tool had become simpler.

A hard stop is only responsible if it leaves something useful. Long investigations often spend most of their time ruling out attractive but false explanations. Losing that trail at the ceiling would make the next attempt repeat the expensive part, while returning an unlimited transcript would defeat delegation by flooding the parent's context. The manager therefore retains a bounded tail of the child's recent work. If the child hits its ceiling, crashes, or loses a provider connection, that evidence becomes a recovery checkpoint: what it was doing, what it ruled out, and where another task can resume. Without that checkpoint, the limit would protect resources by throwing away the work needed to continue.

The same ownership applies to cancellation. Interrupting a parent that is waiting does not silently cancel the child. Cancelling the child tears down what the child started. That rule came from the concrete cost I wanted to avoid: a leaked process can keep my machine awake and keep consuming resources after the task appears finished.

There is one honest limit to this design. Individual child operations and outputs are bounded, but the parent has no global cap on how many children it may start or retain. A universal cap would reject valid parallel work and require eviction rules I do not want. Careless fan-out can therefore consume substantial aggregate resources. I accept that tradeoff because the caller, not a generic limit, has the context to judge whether the parallel work is useful.

This is why I own the operating layer. The model can reason about an instruction, misunderstand it, or behave differently after an update. The runtime still controls authority, execution, teardown, and recovery. I can change models without surrendering those decisions, and I can improve the workflow in response to failures I have actually seen instead of waiting for a vendor's defaults to fit me.

You can [inspect and fork my Pi setup](https://github.com/drsh4dow/pi-setup), but copying it wholesale misses the point. Start with your repeated failures. Decide where judgment must remain yours. Turn dangerous assumptions into tools, owners, bounds, and tests. Delete the machinery those decisions replace.

The model can be rented. The engineering judgment cannot.
