---
title: 'The Senior Signal Is Proportion'
description: 'What reviewing engineering work taught me about senior judgment.'
date: 2025-02-13
updated: 2026-08-01
banner: /images/blog/reviewing-engineering-assessments.png
bannerAlt: 'Blank paper submissions and tracing sheets under a review lamp beside a red pencil'
---

For part of my time at Woven, I reviewed codebases and engineering exercises across seniority levels for US hiring pipelines. I will keep the candidates, materials, and process private. What I can discuss is what repeated close reading changed in my own engineering.

Seniority is not a collection of advanced techniques. It is the quality of the decisions that remain after the engineer is no longer there to explain them.

That became easier to see through comparison. One solution can make almost any design feel inevitable. Several approaches to comparable constraints remove that illusion. One person builds for futures the problem never suggested. Another compresses the task until important behavior disappears. Another leaves exactly enough structure to make the solution understandable and complete.

The language changed between submissions. The underlying judgment did not.

# The problem deserves the right amount of engineering

I stopped asking whether a solution contained enough engineering and started asking whether its engineering was proportionate to the problem.

The contrast often appeared in ordinary work. An overbuilt solution introduced interchangeable implementations and configuration even though the task contained one fixed behavior. Readers then had to understand extension points that no requirement used. An underbuilt solution collapsed several meaningful outcomes into one boolean, leaving callers to guess what had happened. One volunteered distinctions; the other erased them.

Good solutions carried every distinction the task required and none it did not.

This is harder than choosing a preferred pattern. Every hypothetical variation creates a present obligation. A configurable mode has combinations that should behave consistently. An interface asks readers to understand a contract. Those tools may be justified when the behavior puts pressure on the design, but adding them in anticipation of an imagined sequel makes today’s work larger without making it safer.

Underbuilding can look restrained while moving complexity outward. If code loses why validation failed, every caller must recover that meaning or settle for a vague response. Fewer lines in the implementation do not make the system simpler when the rest of it must reconstruct distinctions the implementation discarded.

Production work constantly offers reasons to misjudge the amount: uncertainty, enthusiasm, fear of revisiting a decision, or the desire to make a small task look substantial. Restraint means stopping when the architecture has done its job, not refusing architecture altogether.

Proportion also includes finishing the promises a design actually creates. A small solution can still be incomplete, and adding more machinery cannot compensate for ignoring a realistic failure.

Consider an operation that changes state and then calls a dependency. The dependency fails. Returning its error may look correct, but the caller still needs an honest account of the state already changed. Whether the operation can be retried depends on that answer. The design does not need a framework for every catastrophe; it needs to settle the consequence of the sequence it chose.

This is why I became skeptical of both decorative robustness and happy-path minimalism. Guards against impossible conditions add branches rather than confidence. Yet the failure that follows directly from a real network call or state change is part of the work. Proportion means carrying that promise to completion at the same level of detail as the success path.

The strongest submissions did not anticipate everything. They made their assumptions narrow enough to inspect and gave the failures they introduced a coherent place. That felt less impressive at a glance than a broad framework. It held up better under close reading.

# Code must carry the reasoning

Assessment review removed a familiar convenience: the author was not beside the code to fill in missing intent. That made readability more than style.

Some solutions used tidy pieces but forced me to reconstruct the operation from clues. Names described technical shapes rather than meaning, and data crossed thin wrappers without any layer taking responsibility. Each file looked orderly. Reading across them did not reveal what the program believed it was doing.

Other solutions let the operation remain visible. Important data kept recognizable names from input to outcome, and consequential steps appeared in an order I could follow. Sometimes that meant a longer function telling one coherent story instead of several small methods that only passed values onward. I could understand the choice without inventing an explanation on the author’s behalf.

That difference belongs to proportion too. Splitting code has a cost in navigation and hidden context. Keeping it together has a cost when unrelated responsibilities accumulate. The right shape is the one that exposes the behavior with the least explanatory debt, not the one that produces the neatest file outline.

The absent author became a useful test. Could the code show why a distinction existed and what callers could rely on? If I needed a verbal tour to connect ordinary control flow, the design had moved reasoning out of the artifact. If the code made its assumptions and operation apparent, discussion could focus on the real tradeoffs instead of reconstructing basics.

Repeated review made proportion stand above polish, machinery, and language fluency. Senior judgment is visible in what the engineer chose not to make everyone else carry.
