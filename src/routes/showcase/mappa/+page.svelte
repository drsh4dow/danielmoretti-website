<script lang="ts">
	import { onMount } from 'svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	let mounted = $state(false);

	const revealOptions: Options = {
		rootMargin: '-64px',
		unobserveOnEnter: true,
		onChange: ({ inView, node }) => {
			if (inView) node.classList.add('is-in-view');
		}
	};

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Mappa Case Study | Daniel Moretti</title>
	<meta
		name="description"
		content="Mappa case study about a production voice AI platform for recruitment interview analysis, built by Daniel Moretti."
	/>
	<link rel="canonical" href="https://danielmoretti.com/showcase/mappa" />
	<meta property="og:title" content="Mappa Case Study | Daniel Moretti" />
	<meta
		property="og:description"
		content="Mappa case study about a production voice AI platform for recruitment interview analysis, built by Daniel Moretti."
	/>
</svelte:head>

<article class="pb-16 sm:pb-24">
	<a
		href="/#work-section"
		data-sveltekit-preload-data
		class="group mt-6 inline-flex items-center gap-3 rounded-full text-sm font-bold text-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 sm:mt-10"
	>
		<span
			class="grid size-11 place-items-center rounded-full border border-sky-500/70 transition-colors group-[:hover]:bg-sky-500/10"
		>
			<svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none">
				<path
					d="M15 18L9 12L15 6"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
		<span class="transition-colors group-[:hover]:text-white">Back to selected work</span>
	</a>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal relative grid min-h-[calc(100svh-9rem)] items-center gap-14 overflow-hidden py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24"
	>
		<div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
			<div class="absolute top-1/4 -left-44 size-96 rounded-full bg-sky-500/10 blur-3xl"></div>
			<div class="absolute right-0 bottom-0 size-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
		</div>

		<div class="min-w-0">
			<p
				class="mb-5 flex items-center gap-3 text-xs font-black tracking-[0.24em] text-sky-400 uppercase"
			>
				<span class="h-px w-10 bg-sky-500"></span>
				Case study · Voice AI
			</p>
			<h1
				class="font-inter text-[clamp(4rem,18vw,9rem)] leading-[0.85] font-bold tracking-[-0.07em]"
			>
				Mappa
			</h1>
			<p class="mt-8 max-w-2xl text-xl leading-relaxed text-slate-200 sm:text-2xl">
				A voice AI platform for analyzing recruitment interviews.
			</p>
			<p class="mt-5 text-sm font-bold text-slate-400 sm:text-base">
				Co-Founder & CTO, hands-on IC · 2023 - 2026
			</p>
			<div class="mt-9 flex flex-wrap gap-2" aria-label="Core technology stack">
				<span
					class="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-bold"
					>Rust</span
				>
				<span
					class="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-bold"
					>TypeScript</span
				>
				<span
					class="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-bold"
					>AI Agents</span
				>
			</div>
		</div>

		<div class="relative mx-auto w-full max-w-xl">
			<div class="absolute -inset-5 rounded-[2rem] bg-sky-500/5 blur-2xl" aria-hidden="true"></div>
			<div
				class="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-950/70 p-5 shadow-2xl shadow-sky-950/30 backdrop-blur sm:p-8"
			>
				<div class="mb-8 flex items-center justify-between gap-4">
					<div class="flex items-center gap-2">
						<span class="size-2 rounded-full bg-sky-400"></span>
						<span class="size-2 rounded-full bg-slate-600"></span>
						<span class="size-2 rounded-full bg-slate-700"></span>
					</div>
					<span class="font-mono text-[0.65rem] tracking-[0.18em] text-slate-500 uppercase"
						>Production signal</span
					>
				</div>

				<div class="signal-grid rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7">
					<div class="flex h-32 items-center justify-center gap-1 sm:gap-1.5" aria-hidden="true">
						<span class="signal-bar h-5"></span>
						<span class="signal-bar h-12"></span>
						<span class="signal-bar h-20"></span>
						<span class="signal-bar h-10"></span>
						<span class="signal-bar h-24"></span>
						<span class="signal-bar h-16"></span>
						<span class="signal-bar h-28"></span>
						<span class="signal-bar h-14"></span>
						<span class="signal-bar h-20"></span>
						<span class="signal-bar h-10"></span>
						<span class="signal-bar h-16"></span>
						<span class="signal-bar h-7"></span>
					</div>
					<div class="mt-5 flex items-end justify-between gap-4 border-t border-slate-800 pt-5">
						<div>
							<p class="text-xs font-bold tracking-wider text-slate-500 uppercase">Throughput</p>
							<p class="font-inter mt-1 text-3xl font-bold text-white">100+</p>
						</div>
						<p class="max-w-28 text-right text-xs leading-relaxed text-slate-400">
							interviews per day in production
						</p>
					</div>
				</div>

				<div
					class="mt-5 grid grid-cols-3 gap-2 text-center text-[0.65rem] font-black uppercase sm:gap-3 sm:text-xs"
				>
					<div class="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-3 text-slate-400">
						Listen
					</div>
					<div class="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-3 text-sky-300">
						Reason
					</div>
					<div class="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-3 text-slate-400">
						Report
					</div>
				</div>
			</div>
		</div>
	</section>

	<section use:inview={revealOptions} class:reveal-pending={mounted} class="reveal py-20 sm:py-28">
		<div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
			<div>
				<p class="mb-4 text-xs font-black tracking-[0.24em] text-sky-400 uppercase">
					01 · The problem
				</p>
				<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">
					The interview ended. The insight stayed trapped in audio.
				</h2>
			</div>
			<div class="lg:pt-9">
				<p class="text-lg leading-relaxed text-slate-200 sm:text-xl">
					Recruiters run hundreds of interviews. The raw material is rich, but listening again,
					finding patterns, and turning every conversation into a useful hiring signal takes time.
				</p>
				<p class="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
					Mappa turned that unstructured audio into consistent, structured reports that teams could
					use without replaying every recording.
				</p>
			</div>
		</div>
	</section>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal border-y border-slate-800 py-20 sm:py-28"
	>
		<div class="mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-3xl">
				<p class="mb-4 text-xs font-black tracking-[0.24em] text-sky-400 uppercase">
					02 · The voice pipeline
				</p>
				<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">
					From conversation to decision ready output.
				</h2>
			</div>
			<p class="max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
				An end to end production pipeline processing 100+ interviews every day.
			</p>
		</div>

		<figure>
			<ol
				class="grid min-w-0 items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] md:gap-2"
			>
				<li class="min-w-0 rounded-2xl border border-slate-700 bg-slate-800/40 p-5 sm:p-6">
					<div class="mb-8 flex items-center justify-between">
						<span
							class="grid size-9 place-items-center rounded-full bg-slate-700 text-xs font-black"
							>01</span
						>
						<svg aria-hidden="true" class="size-6 text-sky-400" viewBox="0 0 24 24" fill="none">
							<path
								d="M12 4V20M8 8V16M4 10V14M16 7V17M20 10V14"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					</div>
					<h3 class="font-inter text-xl font-bold">Audio</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-400">
						The interview enters the system.
					</p>
				</li>
				<li class="grid h-8 place-items-center md:h-auto" aria-hidden="true">
					<svg class="size-5 rotate-90 text-sky-500 md:rotate-0" viewBox="0 0 24 24" fill="none">
						<path
							d="M5 12H19M14 7L19 12L14 17"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</li>
				<li class="min-w-0 rounded-2xl border border-slate-700 bg-slate-800/40 p-5 sm:p-6">
					<div class="mb-8 flex items-center justify-between">
						<span
							class="grid size-9 place-items-center rounded-full bg-slate-700 text-xs font-black"
							>02</span
						>
						<span class="font-mono text-xs font-bold text-sky-400">STT</span>
					</div>
					<h3 class="font-inter text-xl font-bold">Deepgram</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-400">Speech becomes searchable text.</p>
				</li>
				<li class="grid h-8 place-items-center md:h-auto" aria-hidden="true">
					<svg class="size-5 rotate-90 text-sky-500 md:rotate-0" viewBox="0 0 24 24" fill="none">
						<path
							d="M5 12H19M14 7L19 12L14 17"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</li>
				<li class="min-w-0 rounded-2xl border border-sky-500/50 bg-sky-500/10 p-5 sm:p-6">
					<div class="mb-8 flex items-center justify-between">
						<span
							class="grid size-9 place-items-center rounded-full bg-sky-500 text-xs font-black text-white"
							>03</span
						>
						<span class="size-3 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.8)]"
						></span>
					</div>
					<h3 class="font-inter text-xl font-bold">LLM analysis</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-300">
						Agents extract and reason over signals.
					</p>
				</li>
				<li class="grid h-8 place-items-center md:h-auto" aria-hidden="true">
					<svg class="size-5 rotate-90 text-sky-500 md:rotate-0" viewBox="0 0 24 24" fill="none">
						<path
							d="M5 12H19M14 7L19 12L14 17"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</li>
				<li class="min-w-0 rounded-2xl border border-slate-700 bg-slate-800/40 p-5 sm:p-6">
					<div class="mb-8 flex items-center justify-between">
						<span
							class="grid size-9 place-items-center rounded-full bg-slate-700 text-xs font-black"
							>04</span
						>
						<svg aria-hidden="true" class="size-6 text-sky-400" viewBox="0 0 24 24" fill="none">
							<path
								d="M7 3H14L19 8V21H7V3Z"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linejoin="round"
							/>
							<path
								d="M14 3V8H19M10 13H16M10 17H16"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					</div>
					<h3 class="font-inter text-xl font-bold">Structured reports</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-400">
						Consistent output ready for teams.
					</p>
				</li>
			</ol>
			<figcaption class="mt-6 text-center text-sm text-slate-500">
				The production path, shown without exposing the product interface.
			</figcaption>
		</figure>
	</section>

	<section use:inview={revealOptions} class:reveal-pending={mounted} class="reveal py-20 sm:py-28">
		<div class="mb-12 max-w-3xl sm:mb-16">
			<p class="mb-4 text-xs font-black tracking-[0.24em] text-sky-400 uppercase">
				03 · The intelligence layer
			</p>
			<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">
				Agents built for production, not a demo.
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
				I built the orchestration layer on the Vercel AI SDK. Every path was designed to produce
				reliable structured results under real production conditions.
			</p>
		</div>

		<div class="grid gap-4 lg:grid-cols-3">
			<div class="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 sm:p-8">
				<p class="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">Tool use</p>
				<h3 class="font-inter mt-12 text-2xl font-bold">Give the model a controlled way to act.</h3>
			</div>
			<div class="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 sm:p-8">
				<p class="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">Retries</p>
				<h3 class="font-inter mt-12 text-2xl font-bold">
					Recover when a model call does not land.
				</h3>
			</div>
			<div class="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 sm:p-8">
				<p class="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">
					Structured outputs
				</p>
				<h3 class="font-inter mt-12 text-2xl font-bold">Keep downstream data predictable.</h3>
			</div>
		</div>

		<div class="mt-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 sm:p-8">
			<div class="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
				<p class="font-inter text-5xl font-bold text-sky-400 sm:text-6xl">Hundreds</p>
				<div>
					<h3 class="font-inter text-xl font-bold sm:text-2xl">Eval cases before production</h3>
					<p class="mt-2 max-w-2xl leading-relaxed text-slate-300">
						Hundreds of evaluation cases gated the agent system so quality could be measured before
						changes reached customers.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal grid gap-12 border-y border-slate-800 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20"
	>
		<div>
			<p class="mb-4 text-xs font-black tracking-[0.24em] text-sky-400 uppercase">
				04 · The foundation
			</p>
			<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">
				Event driven by design.
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
				The backend combined TypeScript and Rust with Postgres and Temporal. The result was a
				production system built around durable workflows and clear event boundaries.
			</p>
			<p class="mt-6 text-lg leading-relaxed text-slate-200 sm:text-xl">
				I led the team as the largest code contributor, from the first commit through the production
				platform.
			</p>
		</div>

		<figure class="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5 sm:p-8">
			<figcaption class="mb-8 font-mono text-xs tracking-[0.18em] text-slate-500 uppercase">
				Backend architecture
			</figcaption>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="rounded-xl border border-sky-500/40 bg-sky-500/10 p-5">
					<p class="text-xs font-black text-sky-400 uppercase">Backend language</p>
					<p class="font-inter mt-2 text-2xl font-bold">TypeScript</p>
				</div>
				<div class="rounded-xl border border-sky-500/40 bg-sky-500/10 p-5">
					<p class="text-xs font-black text-sky-400 uppercase">Backend language</p>
					<p class="font-inter mt-2 text-2xl font-bold">Rust</p>
				</div>
			</div>
			<div class="my-4 flex justify-center" aria-hidden="true">
				<svg class="size-5 rotate-90 text-slate-500" viewBox="0 0 24 24" fill="none">
					<path
						d="M5 12H19M14 7L19 12L14 17"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div class="rounded-xl border border-slate-700 bg-slate-800/60 p-5 text-center">
				<p class="text-xs font-black text-slate-400 uppercase">Durable orchestration</p>
				<p class="font-inter mt-2 text-2xl font-bold">Temporal</p>
			</div>
			<div class="my-4 flex justify-center" aria-hidden="true">
				<svg class="size-5 rotate-90 text-slate-500" viewBox="0 0 24 24" fill="none">
					<path
						d="M5 12H19M14 7L19 12L14 17"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<div class="rounded-xl border border-slate-700 bg-slate-800/60 p-5 text-center">
				<p class="text-xs font-black text-slate-400 uppercase">Data layer</p>
				<p class="font-inter mt-2 text-2xl font-bold">Postgres</p>
			</div>
		</figure>
	</section>

	<section use:inview={revealOptions} class:reveal-pending={mounted} class="reveal py-20 sm:py-28">
		<div class="mb-12 max-w-3xl sm:mb-16">
			<p class="mb-4 text-xs font-black tracking-[0.24em] text-sky-400 uppercase">
				05 · Scale and impact
			</p>
			<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">
				Production scale. Measurable outcomes.
			</h2>
		</div>

		<div
			class="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 sm:grid-cols-3"
		>
			<div class="bg-slate-900 p-7 sm:p-9">
				<p class="font-inter text-5xl font-bold text-sky-400 sm:text-6xl">100+</p>
				<p class="mt-4 leading-relaxed text-slate-300">
					SMB and enterprise clients across the Americas
				</p>
			</div>
			<div class="bg-slate-900 p-7 sm:p-9">
				<p class="font-inter text-5xl font-bold text-sky-400 sm:text-6xl">300+</p>
				<p class="mt-4 leading-relaxed text-slate-300">hours cut from hiring cycles</p>
			</div>
			<div class="bg-slate-900 p-7 sm:p-9">
				<p class="font-inter text-5xl font-bold text-sky-400 sm:text-6xl">~$30k</p>
				<p class="mt-4 leading-relaxed text-slate-300">saved per role</p>
			</div>
		</div>
	</section>

	<aside
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal rounded-2xl border border-slate-700 bg-slate-800/40 p-6 sm:p-8"
	>
		<div class="flex gap-4 sm:items-center">
			<span
				class="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-sky-500/40 text-sm font-black text-sky-400 sm:mt-0"
				>i</span
			>
			<p class="text-base leading-relaxed text-slate-300 sm:text-lg">
				The product itself lives behind an NDA, so this page shows the architecture rather than the
				screens.
			</p>
		</div>
	</aside>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal py-24 text-center sm:py-36"
	>
		<p class="mb-4 text-xs font-black tracking-[0.24em] text-sky-400 uppercase">The next build</p>
		<h2 class="font-inter mx-auto max-w-4xl text-4xl leading-tight font-bold sm:text-6xl">
			Need an engineer who goes deep and ships the whole system?
		</h2>
		<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<a
				href="mailto:daniel.morettiv@gmail.com"
				class="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-lg border-2 border-sky-500 px-6 py-3 font-black outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
			>
				<span
					class="absolute inset-0 -z-10 -translate-x-full bg-sky-500 transition-transform duration-300 ease-out group-[:hover]:translate-x-0"
				></span>
				<span>Start a conversation</span>
			</a>
			<a
				href="/#work-section"
				data-sveltekit-preload-data
				class="group inline-flex min-h-12 items-center justify-center rounded-lg px-6 py-3 font-black text-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
			>
				<span class="transition-colors group-[:hover]:text-white">See more work</span>
			</a>
		</div>
	</section>
</article>

<style>
	.reveal {
		transition:
			opacity 500ms ease-out,
			transform 500ms ease-out;
	}

	.reveal.reveal-pending {
		transform: translateY(1rem);
		opacity: 0;
	}

	.reveal.reveal-pending:global(.is-in-view) {
		transform: translateY(0);
		opacity: 1;
	}

	.signal-grid {
		background-image:
			linear-gradient(rgba(51, 65, 85, 0.24) 1px, transparent 1px),
			linear-gradient(90deg, rgba(51, 65, 85, 0.24) 1px, transparent 1px);
		background-size: 24px 24px;
	}

	.signal-bar {
		width: 0.3rem;
		border-radius: 9999px;
		background: linear-gradient(to top, #0284c7, #38bdf8);
		box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal,
		.reveal.reveal-pending,
		.reveal.reveal-pending:global(.is-in-view) {
			transform: none;
			opacity: 1;
			transition: none;
		}
	}
</style>
