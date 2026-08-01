---
title: 'Taking Mappa from First Commit to Production'
description: 'A firsthand account of turning a voice-analysis model into a durable, evaluated product workflow.'
date: 2026-08-01
updated: 2026-08-01
sequence: 60
banner: /images/blog/mappa-first-commit-to-production.png
bannerAlt: 'A studio microphone sending blue voice waves into layered amber forms'
---

A résumé can describe what somebody has done, but it says little about how that person communicates, responds to pressure, or works with other people. Mappa began with the question of whether voice analysis could make some of those less visible signals useful in hiring.

The model was never the whole product. The product was the durable loop around it: collecting an input, moving it through long-running analysis, turning probabilistic output into a structure software could validate, evaluating whether that behavior was acceptable, and presenting the result carefully enough for a person to use. Every part of that loop had to keep working when a process stopped, a provider slowed down, an intermediate result was invalid, or production evidence challenged an earlier assumption.

For grounding: I co-founded Mappa in 2023, served as CTO until May 2026, wrote the first commit, and remained the largest code contributor. By the end of my time there, the platform [served more than 100 B2B customers across the Americas and decoded more than 100 interviews a day](https://danielmoretti.com/showcase/mappa). I can discuss the public architecture and the decisions at its boundaries, but an NDA prevents me from disclosing customers, private data, internal schemas, proprietary matching methodology, workflow definitions, or the evaluation corpus.

# The loop is the product

[Mappa describes its technology](https://mappa.ai/) as extracting more than 100,000 vocal markers from an audio sample and mapping them across 75 behavioral traits. [TechCrunch described](https://techcrunch.com/2025/10/28/mappas-ai-voice-analysis-helps-you-find-the-best-job-candidates-and-will-show-off-its-tech-at-techcrunch-disrupt-2025/) an AI model detecting voice patterns associated with traits such as communication style, empathy, and confidence, with an AI agent collecting candidate answers before hiring teams receive results.

That public description can be reduced to a short path:

```text
voice → analysis → behavioral structure → useful human output
```

The diagram looks simple because it hides the work between the nouns. Each arrow crosses a boundary with its own latency, failure modes, and definition of success. Audio has to reach processing in a usable form. Analysis has to survive work that lasts longer than a normal request. Model output has to become data an application can validate, persist, and render. The report has to communicate something useful without claiming more certainty than the analysis supports.

An AI demo can optimize the impressive middle. It can run once with a clean input, wait synchronously for an answer, and print plausible language. If it fails, its creator restarts it. A production workflow receives overlapping work from people who expect an outcome. It meets provider limits, malformed inputs, partial failures, deploys, disconnections, and retries. Its state has to outlive the process currently handling it.

I came to see production AI as a loop rather than a pipeline with a finish line. Customer use produced evidence. That evidence changed product priorities, workflow boundaries, and evaluation cases. Those changes went back through the system and met production again. A model improvement that could not pass through that loop safely was not yet a product improvement.

# Durable stages make failure legible

The publicly disclosed stack included TypeScript, Rust, Python, PostgreSQL, Temporal, and the Vercel AI SDK. The voice workflow combined speech-to-text, LLM analysis, and structured reports; agent workflows used tools, retries, and structured outputs. Those facts describe the implementation, but the more important choice was to represent long-running work as explicit, durable stages.

Treating the entire path as one synchronous request would have made the user-facing boundary inherit every internal delay and transient fault. Instead, event-driven processing, queues, streaming, and workflow orchestration let work continue across process and provider boundaries. PostgreSQL held durable application state. Temporal gave long-running work an explicit programming model. Different backend components could do the work suited to them without pretending they shared one request lifecycle.

Durability did not make failure disappear. It made failure locatable. When a named stage fails, the system can distinguish work that never started from work that ran and returned an invalid result. It can record whether another attempt is safe. It can expose enough state to decide whether the workflow should retry, wait, or stop. That distinction matters when an operation has side effects or when repeating expensive analysis would create duplicate work.

Retries need an owner and a termination condition. Without both, they can turn a temporary provider problem into a backlog or repeat a side effect that already succeeded. Queues absorb differences in processing time, but they can also hide pressure until latency has accumulated into an operational problem. Streaming can show progress sooner, but it introduces interruption, resumption, and partial-result questions. Temporal makes durable execution explicit, but it adds an operational dependency and a programming model the team must understand.

Those were tradeoffs, not badges of architectural maturity. A queue only earns its place when delayed ownership is clearer than synchronous ownership. A workflow engine only earns its place when the stages and recovery behavior are easier to reason about than they would be in application code alone. More stages create more states, so each boundary has to make an actual production failure easier to prevent, observe, or recover from.

The operating volume was not hyperscale, and it did not need to be. It was enough for overlapping work, provider behavior, and recovery paths to replace the assumptions that survive in a demo. It was enough for “try it again” to become an engineering policy rather than an individual action.

# Structure connects models to software

Language that sounds complete is not necessarily output a product can use. A hiring team did not need a transcript of a model thinking aloud, and downstream software could not safely consume an unbounded chat response. The final artifact had to be structured enough to validate, store, render, and reason about.

That requirement shaped both sides of the model boundary. Upstream analysis had to produce information the application could represent. Downstream interfaces had to communicate a behavioral profile without collapsing it into a magical score. The model output, application schema, and report experience were one product decision, even though they lived in different layers.

Structured output narrows possible shapes; it does not establish that the content is correct. A valid object can still be misleading, inconsistent, or wrong for the task. That is why structure and evaluation had to work together. Structure made malformed output observable to software. Evaluation asked whether well-formed output behaved as the product required.

[My public experience record](https://danielmoretti.com/) states that our agent workflows were gated by hundreds of evaluation cases. The count is less important than the gate. A case mattered when its result could affect a development decision or stop a behavior change from reaching customers. Otherwise it was documentation with a score attached.

Probabilistic systems make anecdotes unusually seductive. Two outputs can both read well while one violates a product requirement. A prompt or model change can improve one class of result and quietly degrade another. Stable cases give that tradeoff somewhere to appear before production incidents or customer impressions settle the argument.

I learned to treat evaluations as product infrastructure. They belonged close enough to development to influence model, prompt, tool, and workflow changes. They also had to represent behavior with consequences: not every variation deserved a gate, while a failure that could distort a report did. This did not turn model behavior into deterministic software. It created an acceptance boundary around the uncertainty the product had chosen to use.

That boundary also affected retries. Repeating a provider call after a network failure is different from repeating analysis because a result failed validation, and both are different from accepting a well-formed result that fails an evaluation. Lumping those outcomes together as “AI failed” would have erased the information needed for safe recovery.

# Production feeds back into design

There was no clean moment when building ended and operation began. Production behavior changed the architecture because it revealed where ownership was vague. Evaluation changed development because it made regressions visible. Product commitments changed reliability work because a delayed or missing report now affected somebody outside the engineering team.

Staying hands-on as CTO kept those consequences close. I had to work in the system, lead the team working in it, and connect technical choices to product commitments. Complexity was not an item on an architecture slide that another group would absorb later. A new stage, dependency, or language boundary had an implementation cost, an operational cost, and a cost to everybody who would have to diagnose it.

That proximity also worked in the other direction. Local elegance could not outrank the full workflow. A component could be clean and still make the product harder to operate. A faster model step could still be a regression if its output weakened the report or failed established cases. The useful unit of progress was not the isolated component; it was the behavior of the complete loop under real conditions.

Mappa’s public stack included multiple languages because different parts of the system had different needs, not because a longer stack made the product more credible. Once those boundaries existed, they had to justify their coordination cost. The same was true of orchestration and streaming. Production architecture was a continuing negotiation between explicit control and the number of states the team had to own.

# A consequential domain changes the finish line

Hiring software can influence consequential human decisions. That makes the handoff from structured output to human interpretation part of the engineering system, not a layer of copy added after the technical work.

The public framing is compatibility rather than declaring traits inherently good or bad. In the same TechCrunch profile, Mappa CEO Sarah Lucena said, “We don’t really categorize traits as good or bad. We understand traits as compatible or not.” The technology page similarly describes combining behavioral voice analysis with a proprietary model to surface signals that do not appear in a résumé.

A polished report can help a person ask better questions, but polish can also imply certainty the underlying signal does not support. Responsible behavior therefore had to span model and prompt behavior, validation, evaluations, report structure, permissions, operational safeguards, and interface language. A cautious model boundary would not rescue a product that rendered an estimate as an unquestionable fact.

This is why the final human output belongs in the same loop as ingestion and analysis. If engineering stops at a valid structured object, it leaves the most consequential interpretation boundary unowned. The product has to consider what the result invites a person to conclude, how uncertainty reaches them, and whether the interface encourages support for a decision or substitution for one.

The platform’s customer and processing volume already demonstrate that it moved beyond a private prototype. Its [oversubscribed $3.4 million seed round](https://mappa.ai/seed-round), led by Draper Associates, and selection among the [Top 20 finalists in TechCrunch Startup Battlefield 2025](https://techcrunch.com/2025/10/27/the-2025-startup-battlefield-top-20-are-here-let-the-competition-begin/) add public context, but they do not measure the quality of the engineering.

The engineering result I value is the loop that remained after the first successful model output: durable stages carrying real conversations through long-running work; explicit retry and queue ownership; structured reports joining probabilistic behavior to application code; evaluation gates influencing what could change; and a product boundary that kept the human decision in view.

Taking Mappa into daily production taught me to look for that loop whenever an AI capability is presented as a product. At Mappa, the durable stages were where model behavior became accountable to processing state, evaluation evidence, report structure, and the person waiting for an outcome. Production was the repeated work of keeping those boundaries connected as each one changed.
