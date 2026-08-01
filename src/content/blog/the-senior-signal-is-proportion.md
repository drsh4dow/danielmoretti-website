---
title: 'The Senior Signal Is Proportion'
description: 'Repeatedly reviewing comparable engineering exercises changed what I trust as evidence of senior judgment.'
date: 2025-02-13
updated: 2025-02-13
banner: /images/blog/reviewing-engineering-assessments.png
bannerAlt: 'Blank paper submissions and tracing sheets under a review lamp beside a red pencil'
---

For part of my time at Woven, I reviewed codebases and engineering exercises across seniority levels for US hiring pipelines. The work covered JavaScript and TypeScript, C#, Java, and Go. I will keep the materials and process private. The useful part is what repeated close reading clarified for me about engineering.

Seniority is not a bag of advanced techniques. It is the quality of the decisions left behind when the engineer is no longer there to explain them.

That sounds less exciting than architecture diagrams, obscure language features, or an elegant abstraction. Good. Most production engineering is less exciting than the performance of engineering. A system has to survive changing requirements, malformed input, partial failure, maintenance by someone tired, and the ordinary pressure to ship. Senior work makes those conditions easier to handle. Clever work can make them harder while looking impressive for ten minutes.

Reviewing assessments sharpened a principle that now guides how I build products, infrastructure, and agent systems: code is evidence, but volume and sophistication are weak evidence. Judgment is stronger.

The repetition mattered. A single solution can make almost any choice seem inevitable. Read several approaches to comparable constraints and inevitability disappears. One person treats every future possibility as a requirement. Another ignores behavior that is already implied by the interfaces in front of them. Another draws a boundary that is narrow enough to understand and complete enough to trust. The language changes, but the decisions remain visible.

Three patterns became especially useful to me: proportion in the scope chosen, completeness across realistic failure paths, and communication embedded in the submitted code. They are related, but they are not interchangeable. A small solution can still be incomplete. A complete solution can still be needlessly elaborate. A sound design can still be difficult to maintain because its reasoning exists only in the author's head.

# Proportion is scope judgment made visible

The first question I learned to ask was not whether a submission contained enough engineering. It was whether the amount and kind of engineering matched the problem.

Technical exercises leave room for interpretation, just as production work does. That room exposes priorities. Repeatedly, some submissions added extension points that no stated behavior exercised. They introduced multiple interchangeable implementations where only one behavior existed, configuration for decisions that could have been made directly, or layers whose main effect was to rename calls on the way through. None of those techniques is inherently wrong. The signal was the absence of pressure that justified them.

Overbuilding is easy to mistake for ambition. It can look orderly and forward-thinking, particularly in a small codebase where every layer remains easy to hold in one person's head. But every hypothetical variation enlarges the contract. An extension point suggests that extension is supported. A configurable mode creates combinations that ought to behave consistently. An interface creates a boundary readers must understand before they know whether it protects anything real. The code may compile and the main behavior may work, yet the solution has accepted obligations the problem never asked it to carry.

The opposite pattern appeared too: a submission would compress the task until important distinctions vanished. Different outcomes became one boolean. Validation was postponed to a place where useful context had already been lost. Domain behavior leaked into generic plumbing because introducing one well-placed concept felt like “too much architecture.” Fewer lines did not make those choices proportionate. They merely transferred work to callers and future readers.

That comparison changed what I mean by simplicity. I do not mean the least code or the fewest files. I mean a solution whose concepts correspond closely to the behavior it must own. Necessary distinctions remain explicit. Speculative distinctions never enter the design. The implementation neither auditions for a larger system nor pretends the current problem is smaller than it is.

Across comparable work, this was a stronger signal than stylistic polish. Many people can make a repository look architectural. Senior judgment appears when the design stops at the right point.

# Completeness is tested by realistic failure paths

The happy path establishes that the central idea is present. It says much less about whether the solution is finished.

A repeated pattern was an implementation that handled valid input convincingly but treated nearby failure behavior as outside the task. Missing or malformed values reached code that assumed they had already been checked. A dependency failure lost its original context. An operation partly changed state before returning an error, with no clear account of what the caller could safely do next. These were not exotic disasters invented to make a review harder. They were consequences available through the solution's own inputs, state changes, or dependencies.

This is where completeness differs from defensive programming. I am not impressed by guards against conditions the program cannot produce. They add branches without adding confidence. I am interested in whether the implementation follows its actual promises through the ways they can realistically fail.

That requires understanding the whole path, not merely adding error handling around individual calls. Validation has to happen while the code still knows what the input means. State changes have to leave an intelligible result if later work fails. Errors have to preserve distinctions the caller can act on. Cleanup has to match the ownership established by the successful path. Tests have to exercise the behavior most likely to expose a broken assumption, rather than duplicate the implementation line by line.

Repeated review made the omissions easier to see because they clustered at boundaries. Parsing, persistence, network calls, asynchronous work, and transitions between representations are places where a locally reasonable function can participate in an incomplete system. A return value may be correct while a side effect is left behind. An error may be caught while the operation remains ambiguous. A retry may be available while repeating the work is unsafe. The code around a boundary reveals whether the author followed the consequence beyond the line that first produced it.

The strongest submissions did not attempt to make failure impossible. They made failure behavior coherent with the rest of the design. If input could be rejected, rejection happened deliberately and at a useful level. If an operation could only partly complete, the resulting state was accounted for. If the implementation depended on external behavior, its assumptions were narrow enough to identify. The code did not need a framework for every catastrophe. It needed an honest answer for the failures introduced by the chosen solution.

Before reviewing comparable exercises, I gave more weight to whether the main design was elegant. Afterward, I trusted the edges more. The edges show whether an engineer understands that “works” is a claim about outcomes, not a screenshot of the successful path.

# Submitted code has to carry the communication

Assessment review removes a comfort common in collaborative work: the author is not beside the reader to supply missing intent. That made code's communicative quality unusually visible.

Some submissions were understandable only after mentally reconstructing the decisions behind them. Names described technical shapes but not domain meaning. Data crossed several thin wrappers without any layer taking responsibility for it. State changed through conventions that were never represented directly. Tests asserted internal calls while leaving the important behavior implicit. The pieces looked tidy, yet the reader had to assemble the system from clues.

Other submissions made their priorities apparent through structure. Important data had recognizable names from entry to outcome. Validation, transformation, and side effects occurred in an order that could be followed. A function could be longer when it told one coherent story; a boundary existed when it protected a real distinction. Tests identified what the code promised, not merely which methods happened to run. Rare comments preserved a constraint that syntax alone could not explain.

This is more than readability as formatting. Consistent style helps, but it cannot repair an obscured ownership model or a fragmented flow. Communication is the degree to which another engineer can infer the system's beliefs from the code: which states are valid, which component owns a transition, which errors retain meaning, and which behavior is stable enough to rely on.

Repeatedly, unnecessary indirection weakened that communication. A reader opening a small operation would be sent through interfaces, adapters, and pass-through methods only to discover that no decision occurred along the route. Each piece was easy to read in isolation. The behavior was hard to see as a whole. The organization optimized the appearance of separation while making understanding cumulative.

Dense directness could fail in the other direction. When several concerns were compressed into an expression or a generic mechanism, the author may have demonstrated fluency but concealed the choices a maintainer needed to inspect. Concision is valuable when it removes noise. It is costly when it removes names for consequential steps.

The distinction I came to trust was whether the submitted code could answer for itself. Not every tradeoff needs prose. In fact, a design that requires an essay to make ordinary control flow defensible is usually telling on itself. But the code should make the common path, ownership, and important states apparent, while a small amount of explanation records only what cannot be expressed directly: an external constraint, a deliberate limitation, or a non-obvious reason not to take the tempting alternative.

This matters because maintenance happens under pressure. The next engineer may be diagnosing a failure, changing a requirement, or reviewing a risky patch with limited time. Code that communicates well reduces the number of assumptions they must recover before acting safely. That is not aesthetic refinement after correctness. It is part of how correctness survives contact with other people.

# What comparison changed

Seeing one solution tells me what an engineer built. Seeing multiple solutions to comparable constraints taught me to notice what each engineer believed the problem deserved.

The senior signal was rarely the most machinery, the cleverest language feature, or the most polished repository. It was proportion: enough structure to hold the real behavior, enough failure handling to complete the promise, and enough clarity for the code to retain its reasoning after submission. Those qualities appeared in different styles and languages. Their common feature was restraint guided by attention, not restraint as an aesthetic.

That is why I now trust judgment more than display. Senior engineers certainly need technical range, but range matters most when it improves selection: knowing which complexity the problem requires, which failure paths belong to the solution, and which decisions must remain visible to the next reader. Repeated review made those choices stand out because comparison stripped away the illusion that any particular architecture was inevitable.

The code that persuaded me most did not ask to be admired. It showed that its author had measured the problem before deciding how much engineering to leave behind.
