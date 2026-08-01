---
title: 'You Should Build Your Own AI Coding Agent Harness'
description: 'The model is not the workflow. Why I built a Pi harness around shared intent, bounded delegation, negative diffs, and verified execution.'
date: 2026-08-01
updated: 2026-08-01
banner: /images/blog/ai-coding-agent-harness.png
bannerAlt: 'Hand-woven blue and slate ribbons cradling a small amber core'
---

I hate that software engineers are expected to live at the mercy of whatever the fuck Anthropic or OpenAI decided was good this month.

The current pitch rewards one thing above all: more autonomy. Let the agent run longer. Give it more work. Spin up more of them. [OpenAI has said that asynchronous multi-agent work will become the default way engineers produce code](https://openai.com/index/introducing-codex/). Anthropic now documents [agents that work independently](https://docs.anthropic.com/en/docs/claude-code/sub-agents), background sessions, and [a `/goal` command](https://docs.anthropic.com/en/docs/claude-code/goal) that continues across turns until a separate small model judges the stated completion condition to be met.

Those capabilities are useful. I use autonomous execution and delegation. But autonomy is not an engineering outcome. Left alone, a more autonomous agent can simply produce more slop before anyone looks at it.

Lines of code became another success metric at exactly the wrong time. A demo celebrates ten thousand generated lines. I care more about whether the change removed a concept, collapsed a path, or left less machinery for the next person to understand.

I wanted a shared workflow instead. The agent should do serious work without making me a passenger in my own codebase. It should understand how I investigate, where I want judgment to remain human, what I consider finished, and why code is a liability before it is an asset.

So I built [my own harness around Pi](https://github.com/drsh4dow/pi-setup).

The model is replaceable. The harness is where my engineering intent lives.

# The Neovim of the agentic era

By “build your own harness,” I do not mean that every engineer should implement an inference server, terminal emulator, sandbox, and agent loop from scratch. That is a good way to spend six months avoiding the product you meant to build.

Pick a runtime you can shape. Then own the operating layer around it.

For me, that runtime is [Pi](https://github.com/earendil-works/pi). Pi feels like the Neovim of the agentic era. It gives me a small, programmable core and gets out of the way. I can change the instructions, tools, context policy, interaction model, and execution semantics without waiting for a vendor to decide that my workflow deserves a settings toggle.

My setup started on April 27, 2026. It grew into three layers.

The constitution is [`SYSTEM.md`](https://github.com/drsh4dow/pi-setup/blob/main/agent/SYSTEM.md), which defines authority, investigation, design, verification, safety, and respect for user-owned work. Procedural skills handle work such as grilling an idea, researching a dependency, mapping a seam, writing a spec, implementing it, and reviewing the result. TypeScript extensions enforce the boundaries prompts cannot: process lifecycles, delegation, context limits, and tool access.

The prompt sets the default contract. Skills load only when their procedure matters instead of bloating every task with every rule. Runtime tools make the costly parts of that contract unavoidable.

This separation matters. Models change quickly. My standards should not be coupled to a model release, and my failure handling should not depend on a model remembering a paragraph buried in its prompt.

Prompts are still the least reliable layer. They influence behavior; they do not enforce it. My child prompt says that a delegate cannot create another delegate, but the runtime also removes delegation tools from the child. It says the child cannot ask the user, and the question tools are absent. Execution ceilings live in code. Session ownership lives in code. Output truncation lives in code.

That duplication is intentional. The prompt explains the operating contract so the model can reason within it. The runtime protects the contract when the model reasons badly. I would not secure an HTTP endpoint by asking clients to behave in its documentation. I do not treat an agent differently because its mistakes arrive as confident prose.

The same test applies to every rule I add. If failure would merely make the output annoying, instruction may be enough. If failure can lose work, leak a process, burn unbounded resources, poison context, or make recovery impossible, the harness needs a mechanism. Good agent experience is not a longer system prompt. It is the smallest enforceable interface that lets the model do useful work without pretending the model is the boundary.

# Collaboration comes before autonomy

The core of my workflow took a lot of inspiration from [Matt Pocock's seven phases of AI development](https://www.aihero.dev/my-7-phases-of-ai-development) and his work on grilling, specs, tickets, execution, and review. I named the influence, then changed the machinery to fit how I work.

The resulting path is roughly:

```text
idea → grill → research or prototype → spec → tickets → implement → review
```

This article went through that boundary. “Backfill the missing years” started as a vague volume goal. The grill turned it into meaningful-work coverage for technical peers, set disclosure rules for private repositories, chose the editorial spine, rejected fake chronology, and made this Pi article the calibration piece. Only then did research become an evidence ledger and prose become a draft. The agent could inspect commits and vendor docs by itself. It could not decide what I was proud of, what I wanted readers to believe, or which private architecture I was willing to discuss.

Not every change needs every step. A small, obvious fix can move directly into implementation. A large feature should not.

The useful boundary is where ambiguity becomes an execution contract.

Early in the process, the human owns the hard product work. What problem are we actually solving? Which tradeoff do we accept? What does the word “account” mean in this domain? Which failure is tolerable? What may be disclosed? A grilling session walks those branches one question at a time. Research answers facts that should not be guessed. A prototype answers questions that prose cannot.

Once the intent is clear, the work becomes a spec and then a set of narrow tickets with explicit blockers and acceptance criteria. At that point the agent can execute autonomously without inventing the destination as it walks.

That is why my system prompt sounds more autonomous than my philosophy might suggest. It tells the agent not to stall, not to ask me for facts it can inspect, and not to stop at a plan when safe work remains. The methodology has already created the boundary. Inside it, timidity is waste.

Autonomy is earned by process. It is not a mode you toggle because the latest model passed a benchmark.

# Code is not the prize

The first invariant in my system prompt is deliberately blunt:

> economy applies to the artifacts you produce - code, diffs, prose - never to the effort you spend.

I want the agent to spend as much reasoning, investigation, and verification as the job needs. I want the resulting artifact to be as small as the problem allows.

That distinction fights a poisonous incentive. Generated code feels free because nobody had to type it. It is not free. Every line becomes something a tired maintainer must read, test, debug, migrate, secure, and eventually delete. Agent-generated abstraction still charges human rent.

My prompt therefore treats every helper, wrapper, interface, option, and module as a loan. A new name has to reduce cognitive load, enforce an invariant, hide substantial complexity, or earn real reuse. Moving an expression behind a function does not make the system simpler. Adding a configurable policy where one decision would do is usually worse.

This does not mean chasing negative diffs as another vanity metric. Necessary code is necessary. Clear tests and explicit failure paths justify their cost. The point is to minimize concepts, states, paths, and ownership burden—not to win code golf.

A delegate failure forced that principle out of the prompt and into the architecture.

# The child that would not stop

Delegation is useful because context is scarce. A child can inspect a noisy subsystem, research a dependency, or review a diff without filling the parent's conversation with every file and dead end. It returns the conclusion; the parent keeps the broader judgment and integrates the result.

My delegate tool creates a fresh in-memory Pi session. The child receives a self-contained task brief, a dedicated system prompt, controlled tools, and its own lifecycle. It cannot delegate again or ask the user a question it has no channel to deliver. The parent can inspect it, steer it, wait for it, or cancel it.

An early version had an ugly failure. Children kept working past the point where their effort had value. They would continue exploring or iterating while time and tokens disappeared. A child with no credible convergence path is not diligent. It is a leak.

My first response was predictable. I added limits.

The [hard-limit change](https://github.com/drsh4dow/pi-setup/commit/39da9a59) added 310 lines and removed 10. Different effort levels received different time and token budgets. A fast child got a short leash; a more thorough child got more room. I followed it with a budget-aware child prompt that tried to make the model converge before its budget expired.

It sounded reasonable. It was also the wrong interface.

The caller chose `fast` or `thorough` as a reasoning decision. Hidden underneath, that choice also changed how long the task was allowed to live. Work classified as `fast` received less time even while it was still useful. I had traded one invisible failure mode for another.

Another timeout option would only preserve the confusion.

I replaced the effort-scaled machinery with one execution ceiling for every child:

```typescript
export const MAX_EXECUTION_MS = 60 * 60_000;
export const MAX_EXECUTION_TOKENS = 60_000_000;

export function thinkingForEffort(effort: 'fast' | 'thorough') {
	return effort === 'fast' ? 'low' : 'high';
}
```

Effort now selects reasoning depth and nothing else. Every run gets the same documented hard stop. There is no soft “please wrap up” prompt pretending the model can reliably manage an infrastructure contract.

That [redesign](https://github.com/drsh4dow/pi-setup/commit/6b3762be) added 86 lines and deleted 483. The old per-effort budgets, stage-specific deadlines, convergence warnings, and tests for behavior the interface should never have promised disappeared with it.

The negative diff was not cleanup after the real feature. It was the real feature.

# Failure has to return something useful

A hard stop creates its own problem. If the child reaches the execution ceiling, crashes, or loses a provider connection, the parent still needs enough evidence to recover.

The delegate manager keeps a bounded trail of the child's recent messages and tool calls. On abnormal settlement, that tail becomes a termination checkpoint. The parent can see what the child was doing, what it ruled out, and where a new task brief should begin. Successful output is bounded in context too; oversized results can spill to a temporary file rather than flooding the parent conversation.

This is a recurring rule across my harness. Output buffers have byte limits. Background terminals have session owners, process limits, retained-tail limits, and a termination path. Web responses are archived outside the model context and retrieved deliberately. Failure should be visible, but it does not get infinite space just because something went wrong.

Ownership matters as much as limits. Interrupting a waiter should not silently cancel the child it was waiting for. Cancelling the child should own teardown. A child-created background process belongs to that child's session and dies with it. If two children need isolated worktrees, the parent prepares them and owns integration.

I considered making delegation create, populate, merge, and clean up Git worktrees automatically. I rejected it. No generic tool can decide how to merge two semantically conflicting implementations, and non-Git directories would need a second lifecycle. Passing an existing `cwd` keeps delegation deep and small. The caller retains the judgment.

One exception is deliberate. The manager bounds each run, each wait, each pending send, each output, and each shutdown, but it does not impose a global limit on the number of children a parent may start or retain in one session. The parent owns fan-out. A universal admission cap would block valid parallel work and introduce eviction semantics I do not want. That tradeoff can consume a lot of resources if the parent behaves badly. It is stated, not hidden.

“Bound everything” is a useful pressure. Honest exceptions are better than fake universality.

# Personal tooling deserves production discipline

This is my setup. There is one user. That does not make its failures cheap.

A leaked process can keep my machine awake. A runaway delegate can burn real money. A truncated UTF-8 buffer can make the only useful error unreadable. A cancellation race can destroy the evidence needed to resume work. A web tool can poison the main context with an entire repository when I needed one paragraph.

So the repository has CI and tests for the failures I can actually encounter. The delegate tests cover cancellation during creation, late children arriving after shutdown, interrupted waits, concurrent cancellation, stalled steering, queued messages after settlement, and uncooperative providers. The terminal tests cover process groups, inherited pipes, overlapping kills, bounded shutdown, and UTF-8-safe tails. The web tests cover partial fetch failure, archive isolation, traversal guards, malformed inputs, and request abortion.

This is not enterprise cosplay. It is respect for my own time.

The harness is also imperfect. End-to-end UI tests are not part of the default CI gate. The aggregate delegate tradeoff can still hurt. Some model and provider behavior remains outside my control. My current setup will keep changing because I keep finding assumptions that looked fine until real work touched them.

That is another reason to own it.

# The model is still not the workflow

[OpenAI's own engineering material now calls the agent loop and execution logic around a model a “harness”](https://openai.com/index/unrolling-the-codex-agent-loop/), then discusses its tools, instructions, sandbox, and context handling. That is a welcome correction to the idea that model intelligence alone determines the result.

But the most important part of a personal harness is not the loop. It is the engineer encoded around it.

Mine says that facts should be inspected before questions are asked. Public prose needs a human owner. A failing first attempt is evidence, not a blocker. A third attempt against the same hypothesis is thrashing. Tests are inspected before success is claimed. Existing user changes are not disposable. Code must carry its rent. The agent may work autonomously once the intent is clear, but it does not get to redefine the intent for convenience.

Those choices are opinionated. Good. A workflow without opinions is just the vendor default with more files.

Building this harness made engineering more enjoyable for me. Not because it removed me from the work, and not because it turned every idea into a one-shot prompt. It gave me a capable partner without asking me to surrender the craft. I can spend more time shaping the problem and still remain present in the result.

You can [inspect and fork my Pi setup](https://github.com/drsh4dow/pi-setup), but copying it wholesale would miss half the point. Fork the ideas, not my personality. Write down how you make decisions. Find the repeated failure a prompt cannot fix. Give it a tool, an owner, a bound, and a test. Delete whatever that decision makes obsolete.

The harness can be copied. The result is still yours to own.
