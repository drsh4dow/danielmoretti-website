---
title: 'The Support Ticket Starts in Product Discovery'
description: 'Owning discovery, interface, deployment, and support made the downstream cost of early product decisions impossible to ignore.'
date: 2023-06-15
updated: 2023-06-15
banner: /images/blog/six-years-end-to-end.png
bannerAlt: 'Product sketches, prototypes, calipers, and a finished object on a workbench'
---

For six years, my job was not to finish the engineering ticket. It was to make the product work.

From January 2017 to April 2023, I worked as an independent engineer, building production web applications across different sectors. The useful part of that sentence is not “independent.” It is that I owned the path from an unclear request to software that people could keep using after I shipped it.

That path included product definition, UX, implementation, deployment, and support. Sometimes it included design in Figma, server code, third-party integrations, CI, and the uncomfortable conversation about why an apparently small request would create a maintenance problem. There was no product manager upstream to turn uncertainty into a neat backlog, no platform team downstream to absorb operational mistakes, and no support department to make confusing behavior somebody else’s problem.

This changed how I judge engineering work.

When the person defining the feature is also the person designing the interface, writing the code, deploying it, and answering when it breaks, technical decisions stop being local. A shortcut in discovery becomes a strange screen. A strange screen becomes support. A convenient abstraction becomes a migration. A deployment assumption becomes an interruption for someone trying to do their job.

End-to-end ownership compresses that entire chain into one feedback loop. It does not make every decision correct. It makes the cost of bad judgment harder to ignore.

# Support begins before there is an interface

Clients rarely arrive with product definitions. They arrive with frustrations, existing habits, lists copied from another system, or a sentence like “we need a platform for this.” If I treated that sentence as a specification, I could deliver exactly what was requested and still create months of avoidable support.

Discovery was therefore not a ceremony before engineering. It was the first place I could reduce the product’s future operating cost. I needed to understand who was doing the work, what information they had at that moment, what happened immediately before and after, and which exceptions were common enough to deserve a first-class path. Requirements that described screens without describing decisions were especially dangerous. “Add a patient form” says almost nothing about how that form participates in a working day.

[E-Ficha](https://danielmoretti.com/showcase/e-ficha), a medical-administration application, made that causal chain concrete. Consider the workflow around an appointment. Finding a patient, reviewing prior history, recording current information, and producing a prescription are related actions, even if a feature list places them on separate screens. If discovery reduced the request to “patient form,” the interface could technically save every field while forcing the operator to search again, re-enter information, or reconstruct context before producing the document needed at the end.

I had to treat the appointment as a workflow rather than a collection of records. Patient history affected what context belonged near the current action. Scheduling affected how the patient and appointment were reached. Prescription generation meant the result was not only data in a database but also a dependable printable artifact. Multiline autocompletion had value only where it reduced repetitive writing without taking control away from the operator.

The benefit of owning that definition was continuity: I could make the data model, information hierarchy, and generated output serve the same sequence of work. The cost was that discovery took time before there was anything impressive to demonstrate. It also required me to challenge apparently concrete requests, knowing that the easy path would be to build the named screen and let staff absorb the gaps later.

That is where many support tickets are born. The eventual report might say that a field is missing, a document takes too long to prepare, or the user cannot find what they need. By then the visible defect is in the interface. Its cause may be an early decision to model a record instead of the work surrounding it.

# An interface commits the product to a model

Once I understood a workflow, UX turned that understanding into constraints. An interface determines which states people can create, which transitions they can understand, and which mistakes they can recover from. Those are architectural decisions expressed through controls and language.

This made me value fewer, stronger paths over flexible-looking screens. Every option creates a question somebody may eventually have to answer. Every field asks for attention. A button that permits an ambiguous action does not merely create a visual problem; it introduces ambiguity into the product’s state. A form that does not make successful submission clear can produce duplicate work even when its server endpoint behaves perfectly.

Owning UX alongside implementation let me resolve some of those problems without negotiating across disciplines. I could change the screen when the underlying model made the intended action unclear, or change the model when the screen needed awkward explanations to conceal it. The corresponding cost was the breadth of attention required. Product discovery, visual design, and application code reward different modes of thought, and moving among them could interrupt deep technical work. It also made it easier for my own assumptions to survive unless I deliberately listened to how people used what I had built.

Support corrected those assumptions. Repeated confusion was evidence about the product, not proof that users had failed to read it correctly. Not every question called for another feature. Sometimes the better response was clearer language, a stronger default, a manual escape hatch, or refusing an option that would make the ordinary path harder to understand. Because I would answer for the result, I had a reason to remove uncertainty before encoding it.

# Content ownership reaches all the way to deployment

[DarSpa](https://danielmoretti.com/showcase/darspa), a healthcare center’s website, exposed the same chain through content rather than clinical administration. The important workflow was not how I moved a page from Figma into code. It was how ordinary editorial changes could reach the published site without turning each change into an engineering request.

Using Prismic as the content source assigned day-to-day content ownership outside the codebase. That discovery decision constrained the components I built: they had to accept the content shapes editors could actually manage while keeping the rendered pages coherent. If a component depended on a brittle combination of fields, the apparent flexibility of the content system would return as preview confusion, broken layouts, or a request for me to repair a routine update. If every adjustment required a new component branch, managed content would only disguise developer ownership rather than transfer it.

The same choice changed deployment. Content that belonged to editors should not require a code release, while changes to rendering logic still needed the controlled path provided by CI. Separating those responsibilities reduced the number of ordinary updates waiting on me. It also created a new boundary to support: the content model and component contract had to remain aligned. Giving someone direct control over content is a real ownership benefit, but it replaces some deployment work with the need to design safe editorial constraints and diagnose failures across an external service.

That tradeoff was worth making because it followed the actual workflow. The content owner needed to publish; I needed code changes to remain reproducible and reviewable. One pipeline would have forced either unnecessary engineering involvement or unsafe application changes into an editorial tool.

The website’s forms showed the other side of the same lesson. What a visitor sees as a few fields continues through server handling and message delivery. A polished form is not complete if its submission does not arrive, and reliable server behavior does not rescue a form people are unwilling or unable to complete. Owning both ends let me evaluate the whole path. It also meant an integration failure reached me rather than disappearing behind a team boundary.

# Deployment tests the discovery assumptions

Software running on my machine is still a proposal. Deployment is where early assumptions meet environment configuration, external services, build behavior, DNS, browsers, networks, and real data.

Independent ownership removed the comforting fiction that handing code to another team meant the engineering was finished. I had to choose technology based not only on how quickly I could build with it, but on whether I could understand a failed deployment and return months later without reconstructing the system from fragments. Reproducible builds and CI reduced reliance on memory. Managed services and integrations could remove repeated work, but each also introduced an external contract I might eventually have to diagnose.

The benefit was a short path from production evidence back to the product decision. I did not need to guess whether a deployment assumption was creating operational friction; I encountered the friction myself and could change the system. The cost was interruption. The same concentration of context that made diagnosis faster also made me the escalation path, and time spent restoring or investigating the product displaced planned work.

That pressure changed what “fast” meant. An implementation was not fast if it repeatedly required explanations, manual repairs, or nervous deployments. A dependency was not convenient if its failure modes were opaque when I was responsible for recovery. The first week of development mattered less than the accumulated cost of keeping the product usable.

There was no universal rule to choose the simplest stack or avoid every integration. DarSpa’s managed content reduced dependence on code deployments while adding a service boundary. E-Ficha’s calendar integration could connect the application to an existing scheduling workflow while adding another contract to maintain. The useful question was always where the benefit landed and who inherited the failure.

# Support completes the discovery loop

Support changed me more than any framework did because it returned consequences without respecting the categories I used to build the system. People did not report “a product-definition error” or “an invalid information hierarchy.” They reported that they could not complete what they came to do.

Healthcare-administration work made that responsibility concrete. My public résumé states that systems I built were used daily by clinical staff. I do not publish patient information, client identities, adoption numbers, or clinical outcomes, and building in a healthcare context does not make me a clinician. The safe lesson is enough: software used during someone else’s working day has to respect that day.

Reducing repeated entry, keeping relevant history available, and making generated documents dependable were product responsibilities because their failures consumed someone else’s attention. The benefit of hearing support directly was access to details that a backlog summary could flatten. The cost was exposure to every rough edge, including issues that could not responsibly be solved with another control or another automated path. Administrative software can support professional work; it does not replace professional judgment.

Support also revealed when a “temporary” decision had become a recurring obligation. A workaround performed once may be cheaper than a feature. A workaround explained every week is product behavior with an undocumented human component. Because I saw those repetitions, I could revisit the discovery premise instead of endlessly treating each report as an isolated defect. But doing so meant accepting rework and admitting that a decision I had carried through design and implementation was wrong.

That is one of the less romantic costs of ownership. Decisions feel personal when one person has followed them through every layer. Breadth does not make me the deepest specialist in accessibility, security, visual design, infrastructure, clinical practice, or legal compliance. The benefit of seeing the whole chain only survives if I recognize where outside expertise is required. Otherwise, continuity becomes a bottleneck and confidence becomes risk.

Six years of answering for discovery, interface, deployment, and support taught me to evaluate a decision by where its consequences land. End-to-end ownership did not mean doing every job forever. It meant refusing to call a local success a finished product.
