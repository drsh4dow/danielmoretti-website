---
title: 'Building an Embroidery Engine in the Browser'
description: 'What it took to move embroidery digitization into Rust and WebAssembly.'
date: 2026-07-29
updated: 2026-08-01
banner: /images/blog/stitchly-browser-embroidery.png
bannerAlt: 'Blue and amber embroidery stitched across a dark glass surface'
---

An embroidery file is a program for a machine, not an image wearing an unusual extension.

It says: move here, put the needle down, jump without sewing, change thread, trim, stop. Sequence and physical units matter. A shape can look fine on screen and still produce a poor sewing path; an attractive preview can hide bytes that describe something else.

That fact shaped Stitchly, my browser workspace for arranging lettering and designs on a hoop and exporting PES, DST, and JEF. The browser needs to respond immediately, especially while someone resizes artwork. But it cannot simply declare its own output authoritative. I ended up running the same Rust digitizer in the browser for speed and at the edge before anything became authoritative.

Compiling Rust to Wasm was the easy part. The real work was deciding what the browser could calculate and what the server could trust.

# One plan, two levels of authority

Stitchly stores editable documents containing a hoop, lettering, designs, transforms, and thread choices. The document compiles into a flat, disposable machine plan. Preview, safety checks, and export all consume that plan, so they share the same rounding, ordering, and scaling decisions instead of developing separate interpretations.

Imported machine designs remain opaque stitch blocks. Stitchly can place them, recolor stable thread slots, and constrain unsafe scaling, but it does not pretend to recover semantic vector shapes from needle commands. Reverse-engineering meaning that is no longer in the file would be dishonest.

For an existing document, the browser loads the document and its immutable artifacts, compiles them, and renders the resulting plan. Export differs at one important point: the Worker reloads the authoritative inputs, recompiles them, and writes the machine file. It accepts a document, never a browser-compiled plan. The client may compute an answer for responsiveness; it may not proclaim arbitrary stitch commands canonical.

SVG upload adds digitization before compilation. The server sanitizes and canonicalizes the SVG, applies structural limits, and stores the source under its digest. The browser receives those canonical bytes and an explicit physical size. A module Worker loads the Wasm digitizer off the main thread and returns a bounded, format-neutral candidate for immediate display.

The browser submits that candidate with its source and build identity. At the edge, an adapter runs the same Rust crate against the canonical source. Only that recomputation may publish the immutable stitch block used by projects and exports. A late browser result also cannot overwrite a newer edit. This keeps the expensive computation close to the pointer without trusting browser-supplied machine instructions.

# The remote job that failed resizing

The first design used Ink/Stitch 3.2.2 in a pinned Cloudflare Container. An asynchronous job sent it canonical SVG and eventually published the result. It was defensible infrastructure: Ink/Stitch is mature, the native application was isolated, and a failed attempt left the previous valid design intact.

It was also wrong for resizing. Changing an SVG's physical size changes stitch placement and density, so committing a new size requires fresh digitization. Under the remote design, that meant scheduling the job, starting the container, running Ink/Stitch, and returning the result while the interface polled. Further resizing and export waited.

Together, those steps turned direct manipulation into a remote job queue.

Faster polling would only have polished the delay. The replacement moves valid geometry under the pointer, then starts keyed Wasm work on commit. The browser shows the candidate immediately; the edge recomputes it before publication. If recomputation fails, the last valid design survives. The same Rust computation now serves interaction and trusted output, rather than forcing one of them to imitate the other.

The engine's lineage needs to be explicit. Stitchly's TypeScript pattern model and PES/PEC, DST, and JEF codecs are a hand port of the relevant parts of MIT-licensed [pystitch v1.0.1](https://github.com/inkstitch/pystitch/tree/v1.0.1); its license and third-party notice remain with the port. Pystitch belongs to the pyembroidery lineage and is used by Ink/Stitch. I wrote the port and architecture, but its codec behavior is not mine.

The Rust digitizer has different provenance. [Ink/Stitch](https://inkstitch.org/) is GPL-3.0-or-later and supplied the pinned behavioral reference and parity corpus. The Rust crate is independent work: published algorithms and observable behavior could be studied, but GPL source text and structure were not copied into the differently licensed product. Its permissively licensed geometry dependencies do not make the proprietary, otherwise unlicensed repository MIT. That attribution and separation matter more than a recital of the fill algorithm.

# Similar enough must still be provable

Machine-file codecs have a clean oracle: the pinned pystitch corpus can generate deterministic fixtures for byte-level comparison. Digitization is less tidy. Ink/Stitch's geometry stack and Stitchly's Rust stack do not make every rounding decision alike. Two paths may differ at isolated outer points while preserving the shape and its interior coverage. Exact coordinate matching would copy incidental quirks; looking at thumbnails and saying “close enough” would prove almost nothing.

So parity is perceptual rather than stitch-for-stitch. A pinned Ink/Stitch 3.2.2 provider generated files for a fixed SVG corpus. Provider and Rust plans were parsed into the same model and rendered in the same physical viewport. The comparison checked the resulting silhouette, spacing, coverage, and visible travel, while retaining provider, candidate, and diff images for review.

Some differences remained as thin fringes or isolated points on rotated and curved shapes. I changed rules that improved the corpus and froze explicit visual acceptances for edge-only gaps I could not derive consistently. Those are product judgments, not mathematical equivalence.

An image cannot reveal malformed machine commands, byte equality cannot establish fill quality, and one pinned profile does not establish support for all of Ink/Stitch.

A preview has a harder physical limit. Thread, stabilizer, fabric, tension, needle, and machine can all change the result. Structural guardrails and perceptual comparisons cannot certify a sew-out. A physical sewn sample remains evidence the browser alone cannot manufacture. The exported file still has to meet the material world.

The engine became trustworthy when I stopped asking the browser to be trusted. It can do the hard work immediately. It just does not get the final word.
