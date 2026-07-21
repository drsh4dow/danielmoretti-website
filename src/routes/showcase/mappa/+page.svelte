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
		content="Mappa decodes human behavior from voice using a proprietary neural network and LLMs."
	/>
	<link rel="canonical" href="https://danielmoretti.com/showcase/mappa" />
	<meta property="og:title" content="Mappa Case Study | Daniel Moretti" />
	<meta
		property="og:description"
		content="Mappa decodes human behavior from voice using a proprietary neural network and LLMs."
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
				Behavior decoding
			</p>
			<h1
				class="font-inter text-[clamp(4rem,18vw,9rem)] leading-[0.85] font-bold tracking-[-0.07em]"
			>
				Mappa
			</h1>
			<p class="mt-8 max-w-2xl text-xl leading-relaxed text-slate-200 sm:text-2xl">
				Mappa decodes human behavior from voice.
			</p>
			<p class="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
				A short recording becomes a behavioral profile.
			</p>
			<p class="mt-6 text-sm font-bold text-slate-400 sm:text-base">
				Co-Founder & CTO · 2023 - 2026
			</p>
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
						>Behavior signal</span
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
							<p class="text-xs font-bold tracking-wider text-slate-500 uppercase">Decoded daily</p>
							<p class="font-inter mt-1 text-3xl font-bold text-white">100+</p>
						</div>
						<p class="max-w-28 text-right text-xs leading-relaxed text-slate-400">
							interviews in production
						</p>
					</div>
				</div>

				<div
					class="mt-5 grid grid-cols-3 gap-2 text-center text-[0.65rem] font-black uppercase sm:gap-3 sm:text-xs"
				>
					<div class="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-3 text-slate-400">
						Voice
					</div>
					<div class="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-3 text-sky-300">
						Decode
					</div>
					<div class="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-3 text-slate-400">
						Behavior
					</div>
				</div>
			</div>
		</div>
	</section>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal border-y border-slate-800 py-20 sm:py-28"
	>
		<div class="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-20">
			<div>
				<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">The technology</h2>
			</div>
			<div class="lg:pt-9">
				<p class="text-lg leading-relaxed text-slate-200 sm:text-xl">
					Mappa is novel technology, not an API wrapper. Its proprietary neural network has 100M+
					parameters, analyzes 100,000+ vocal markers, and maps them to 75 behavioral traits that
					LLMs help interpret.
				</p>
			</div>
		</div>
	</section>

	<section use:inview={revealOptions} class:reveal-pending={mounted} class="reveal py-20 sm:py-28">
		<div class="mb-10 max-w-3xl sm:mb-14">
			<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">Business metrics</h2>
		</div>

		<h3 class="mb-4 text-sm font-black tracking-[0.18em] text-slate-400 uppercase">
			Business impact
		</h3>
		<div
			class="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-5"
		>
			<div class="bg-slate-900 p-6 sm:p-7">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">100+</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">B2B clients across the Americas</p>
			</div>
			<div class="bg-slate-900 p-6 sm:p-7">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">100+</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">interviews decoded daily</p>
			</div>
			<div class="bg-slate-900 p-6 sm:p-7">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">300+</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">hours cut per hiring cycle</p>
			</div>
			<div class="bg-slate-900 p-6 sm:p-7">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">~$30k</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">saved per role</p>
			</div>
			<div class="bg-slate-900 p-6 sm:p-7">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">72h</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">voice note to ranked shortlist</p>
			</div>
		</div>

		<h3 class="mt-10 mb-4 text-sm font-black tracking-[0.18em] text-slate-400 uppercase">
			The model
		</h3>
		<div
			class="grid gap-px overflow-hidden rounded-3xl border border-slate-800 bg-slate-800 sm:grid-cols-3"
		>
			<div class="bg-slate-950 p-6 sm:p-8">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">100M+</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">model parameters</p>
			</div>
			<div class="bg-slate-950 p-6 sm:p-8">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">100,000+</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">vocal markers analyzed</p>
			</div>
			<div class="bg-slate-950 p-6 sm:p-8">
				<p class="font-inter text-4xl font-bold text-sky-400 sm:text-5xl">75</p>
				<p class="mt-3 text-sm leading-relaxed text-slate-300">behavioral traits mapped</p>
			</div>
		</div>
	</section>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal border-y border-slate-800 py-20 sm:py-28"
	>
		<div class="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-20">
			<div>
				<h2 class="font-inter text-3xl leading-tight font-bold sm:text-5xl">My part</h2>
			</div>
			<div class="lg:pt-9">
				<p class="text-lg leading-relaxed text-slate-200 sm:text-xl">
					I built Mappa from the first commit to 100+ clients across the Americas. I led the team as
					its largest code contributor and stayed hands-on throughout.
				</p>
			</div>
		</div>
	</section>

	<aside
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal mt-20 rounded-2xl border border-slate-700 bg-slate-800/40 p-6 sm:mt-28 sm:p-8"
	>
		<div class="flex gap-4 sm:items-center">
			<span
				class="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-sky-500/40 text-sm font-black text-sky-400 sm:mt-0"
				>i</span
			>
			<p class="text-base leading-relaxed text-slate-300 sm:text-lg">
				Mappa is protected by an NDA, so this page focuses on technology and outcomes.
			</p>
		</div>
	</aside>

	<section
		use:inview={revealOptions}
		class:reveal-pending={mounted}
		class="reveal py-24 text-center sm:py-36"
	>
		<h2 class="font-inter mx-auto max-w-4xl text-4xl leading-tight font-bold sm:text-6xl">
			Need a hands-on CTO who ships?
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
