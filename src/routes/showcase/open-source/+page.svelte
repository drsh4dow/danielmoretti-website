<script lang="ts">
	import { onMount } from 'svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	const projects = [
		{
			name: 'upwork-wlroots-bridge',
			language: 'Rust',
			description:
				'Reimplements the GNOME Screenshot and Idle DBus services for wlroots compositors like Sway, Hyprland, and River, so Upwork proof-of-work screen capture runs on modern Wayland.',
			href: 'https://github.com/drsh4dow/upwork-wlroots-bridge',
			note: 'Most starred'
		},
		{
			name: 'qstash-rs',
			language: 'Rust',
			description: 'Rust SDK for Upstash QStash.',
			href: 'https://github.com/drsh4dow/qstash-rs',
			note: null
		},
		{
			name: 'agentic-coding-field-manual',
			language: 'Docs',
			description:
				'Practical guide for using AI coding agents without dropping production standards: guardrails, the plan, execute, test, commit loop, and no-mock testing.',
			href: 'https://github.com/drsh4dow/agentic-coding-field-manual',
			note: null
		},
		{
			name: 'bevy-agent-feedback-plugin',
			language: 'Rust',
			description:
				'Lets AI coding agents see and control a running Bevy game through remote input injection, screenshots, and frame-synced feedback over a JSON-lines TCP protocol.',
			href: 'https://github.com/drsh4dow/bevy-agent-feedback-plugin',
			note: null
		},
		{
			name: 'pi extensions (pi-questions, pi-delegate, pi-web-minimal)',
			language: 'TypeScript',
			description:
				'A suite of extensions for the pi coding agent: structured planning questions, isolated child-agent delegation, and context-safe web research tools.',
			href: 'https://github.com/drsh4dow?tab=repositories',
			note: '3 extensions'
		},
		{
			name: 'lx-theming-suite',
			language: 'Svelte',
			description: 'Unified Linux theming for QT and GTK.',
			href: 'https://github.com/drsh4dow/lx-theming-suite',
			note: null
		}
	];

	let mounted = $state(false);
	let isInView = $state(false);
	const options: Options = {
		rootMargin: '-80px',
		unobserveOnEnter: true,
		onChange: ({ inView }) => {
			isInView = inView;
		}
	};

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Open Source | Daniel Moretti</title>
	<meta
		name="description"
		content="Open-source projects by Daniel Moretti across Rust, TypeScript, AI coding agents, Wayland, and Linux tooling."
	/>
	<link rel="canonical" href="https://danielmoretti.com/showcase/open-source" />
	<meta property="og:title" content="Open Source | Daniel Moretti" />
	<meta
		property="og:description"
		content="Open-source projects by Daniel Moretti across Rust, TypeScript, AI coding agents, Wayland, and Linux tooling."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://danielmoretti.com/showcase/open-source" />
</svelte:head>

<section
	use:inview={options}
	class="relative isolate mx-auto max-w-6xl overflow-hidden px-3 py-16 transition-[opacity,transform] duration-500 ease-out sm:px-6 sm:py-24 lg:py-32
		{mounted && !isInView ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}"
>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-16 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl sm:h-96 sm:w-96"
	></div>

	<header class="mb-10 sm:mb-14 lg:mb-16">
		<div class="mb-6 flex min-w-0 items-center">
			<h1 class="font-inter shrink-0 pr-5 text-4xl font-bold sm:pr-8 sm:text-6xl">Open Source</h1>
			<div class="h-px min-w-0 flex-1 bg-sky-500"></div>
		</div>
		<p class="mb-4 text-sm font-bold tracking-[0.18em] text-sky-400 uppercase">
			Rust · TypeScript · AI Agents
		</p>
		<p class="max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
			Most of my best work lives behind an NDA. Open source is what escaped.
		</p>
	</header>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
		{#each projects as project, index}
			<a
				href={project.href}
				target="_blank"
				rel="noreferrer"
				data-sveltekit-preload-data="off"
				aria-label={`View ${project.name} on GitHub`}
				class="group min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
			>
				<div
					class="flex h-full min-w-0 flex-col rounded-2xl border border-slate-700/70 bg-slate-800/40 p-5 shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out group-focus-visible:border-sky-500/70 group-[:hover]:-translate-y-1 group-[:hover]:border-sky-500/70 group-[:hover]:bg-slate-800/70 group-[:hover]:shadow-xl group-[:hover]:shadow-sky-950/30 sm:p-7"
				>
					<div class="mb-6 flex items-start justify-between gap-3">
						<div class="flex min-w-0 flex-wrap items-center gap-2">
							<span
								class="rounded-full border border-sky-500/30 bg-sky-950/70 px-3 py-1 text-xs font-bold tracking-wide text-sky-300"
							>
								{project.language}
							</span>
							{#if project.note}
								<span
									class="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-bold tracking-wide text-slate-300"
								>
									{project.note}
								</span>
							{/if}
						</div>
						<span class="font-inter shrink-0 text-xs font-bold text-slate-500">
							{String(index + 1).padStart(2, '0')}
						</span>
					</div>

					<h2
						class="font-inter mb-3 text-xl font-bold [overflow-wrap:anywhere] text-slate-50 transition-colors duration-300 group-[:hover]:text-sky-300 sm:text-2xl"
					>
						{project.name}
					</h2>
					<p class="mb-8 flex-1 text-base leading-relaxed text-slate-300">{project.description}</p>

					<div class="flex items-center gap-2 text-sm font-bold text-sky-400">
						<span>View repository</span>
						<svg
							aria-hidden="true"
							viewBox="0 0 20 20"
							fill="none"
							class="h-4 w-4 transition-transform duration-300 group-[:hover]:translate-x-1"
						>
							<path
								d="M4 10h12m-5-5 5 5-5 5"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-10 flex justify-center sm:mt-14">
		<a
			href="https://github.com/drsh4dow"
			target="_blank"
			rel="noreferrer"
			data-sveltekit-preload-data="off"
			class="group rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
		>
			<span
				class="inline-flex items-center gap-3 rounded-lg border border-sky-500 px-5 py-3 font-bold text-sky-300 transition-[color,background-color] duration-300 group-focus-visible:bg-sky-500 group-focus-visible:text-slate-950 group-[:hover]:bg-sky-500 group-[:hover]:text-slate-950"
			>
				<span>More on GitHub</span>
				<svg
					aria-hidden="true"
					viewBox="0 0 20 20"
					fill="none"
					class="h-4 w-4 transition-transform duration-300 group-[:hover]:translate-x-1"
				>
					<path
						d="M4 10h12m-5-5 5 5-5 5"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</a>
	</div>
</section>
