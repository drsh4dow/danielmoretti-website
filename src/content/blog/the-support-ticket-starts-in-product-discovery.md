---
title: 'The Support Ticket Starts in Product Discovery'
description: 'What six years of owning discovery through support taught me.'
date: 2023-06-15
updated: 2026-08-01
banner: /images/blog/six-years-end-to-end.png
bannerAlt: 'Product sketches, prototypes, calipers, and a finished object on a workbench'
---

For six years, my job was not to finish an engineering ticket. It was to make the product work.

From January 2017 to April 2023, I worked as an independent engineer building production web applications. I often carried an unclear request through discovery, interface design, implementation, deployment, and support. There was no clean handoff where the consequences became somebody else’s problem.

That changed how I think about product work. A shortcut in discovery tends to return as a confusing screen. Confusion becomes support. A convenient technical assumption becomes a fragile deployment. When the same person meets each consequence, “small” decisions stop looking local.

Support does not begin when someone opens a ticket. It begins when we decide what the product believes the work to be.

# Model the work, not the requested screen

Clients rarely arrived with a product definition. They brought frustrations, current habits, lists borrowed from another system, or a request such as “we need a form.” Building exactly that request could still produce the wrong product.

Discovery was where I could prevent much of the later support burden. I needed to understand who was doing the work, what they knew at that point, what happened before and after, and which exceptions were ordinary rather than exceptional. A screen description without that context was not a specification. It was a clue.

[E-Ficha](https://danielmoretti.com/showcase/e-ficha), a medical-administration application, made this plain. Around an appointment, finding a patient, reviewing prior history, recording current information, and producing a prescription belong to one flow. A feature list can separate them neatly. A working day cannot.

If I had treated the request as a patient form, I could have saved every field correctly while forcing the operator to search again, re-enter details, or rebuild context before producing the document they needed. The database would look complete. The experience would not be.

So the appointment shaped the product. The operator could arrive through the schedule, keep the relevant history nearby while recording current information, and produce the prescription as a dependable printable artifact. That sequence mattered more than whether each screen looked complete in isolation. Autocompletion earned its place where it reduced repetitive writing without taking control away from the operator.

These choices took time before there was much to demonstrate. Challenging a concrete request can feel slower than drawing the named screen. It is usually faster than supporting the gaps for years. The early conversation also gave later decisions a shared reference: we could judge a proposed field or shortcut by whether it helped someone complete the appointment, rather than by whether it fit an isolated screen.

Owning UX and implementation together meant I could change either when the flow exposed a bad assumption. If the data model forced the interface into awkward explanations, I could change the model. If the interface invited an ambiguous state, I could narrow the path. A successful endpoint did not rescue a form that left someone unsure whether submission worked.

Support supplied the correction I could not design in advance. People reported outcomes: they could not find the next step, tell whether an action had completed, or finish the document they came to produce. Repeated confusion was evidence about the product, not evidence that people had failed to read carefully enough.

The answer was not always another feature. Sometimes clearer language or a stronger default removed the question. Sometimes a manual escape hatch served an uncommon case better than another permanent option. Seeing the same problem from discovery through support made those distinctions difficult to ignore.

# Ownership continues after launch

[DarSpa](https://danielmoretti.com/showcase/darspa), a healthcare center’s website, showed the same principle after launch. Routine content changes needed to belong to editors without becoming engineering requests, so the content model and components had to give them useful control while keeping pages coherent. If ordinary edits produced broken previews or calls for repair, the system had only disguised developer support work as flexibility.

That changed my definition of speed. Something was not fast if it demanded repeated explanations, manual repairs, or nervous releases. The first week mattered less than the accumulated cost of keeping the product usable. A workaround performed once may be cheaper than a feature. A workaround explained every week is already product behavior, with a person serving as undocumented infrastructure.

I cannot publish patient or client data, but support still showed where the product was stealing attention from clinical work. That was enough to revisit the original premise instead of polishing each ticket in isolation. The useful evidence was not an architecture category or a clinical claim. It was the recurring moment when someone could not finish what they had come to do.

Support made earlier decisions legible. A question answered repeatedly pointed back to language or structure. A manual repair pointed back to an ownership decision. A fragile release pointed back to a technical assumption that had looked convenient while the product was still local. By then, the cost was being paid in somebody else’s time.

I could not call one layer successful while another paid its bill. The support ticket was often only the receipt.
