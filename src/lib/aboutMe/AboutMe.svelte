<script lang="ts">
	import { onMount } from 'svelte';
	import Me from './me.jpg';
	import Chip from '$lib/chip/Chip.svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	const currentStack = [
		'Rust',
		'TypeScript',
		'Python',
		'Postgres',
		'Temporal',
		'Anthropic API',
		'OpenAI API',
		'Vercel AI SDK',
		'Agent Evals',
		'Linux'
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

<section
	use:inview={options}
	class="my-20 grid grid-cols-1 justify-between gap-10 overflow-hidden transition-[opacity,transform] duration-500 ease-out sm:my-40 lg:mb-60 lg:grid-cols-2
		{mounted && !isInView ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}"
	id="about-me-section"
>
	<div>
		<div class="mb-10 flex items-center sm:mb-14">
			<h2 class="font-inter pr-6 text-3xl font-bold whitespace-nowrap sm:text-5xl">About Me</h2>
			<div class="h-px w-full bg-sky-500"></div>
		</div>
		<p class="text-left text-base text-slate-200 sm:text-xl">
			I'm Daniel, Co-Founder & CTO of Mappa. I built our voice-AI platform for analyzing recruitment
			interviews end-to-end, from the first commit to serving 100+ SMB and enterprise clients across
			the Americas. Its voice pipeline—Deepgram STT → LLM analysis → structured reports—processes
			100+ interviews a day, and I'm now going deep as a hands-on IC.
		</p>
		<p class="py-4 text-left text-base text-slate-200 sm:text-xl">
			It started in 2015, when I built a website for my own small business. Learning HTML, CSS, and
			JavaScript pulled me into a never-ending hole of knowledge and challenges. I then spent six
			years as an independent engineer shipping production web apps—including
			healthcare-administration systems used daily by clinical staff—before founding Mappa in 2023.
		</p>
		<p class="text-left text-base text-slate-200 sm:text-xl">
			I'm passionate about open source (qstash-rs, upwork-wlroots-bridge), Linux, Neovim, and music
			&#9835;. Based in Santiago, Chile (GMT-4).
		</p>

		<div class="mt-8">
			<h3 class="font-inter mb-3 text-sm font-bold tracking-wide text-slate-200 uppercase">
				Current Stack
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each currentStack as technology, i}
					<Chip index={i} chipClass="bg-sky-900">{technology}</Chip>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex items-start justify-center lg:justify-end lg:pt-28">
		<div class="group">
			<figure class="relative w-60 p-4 transition-transform group-[:hover]:scale-95 sm:w-96 sm:p-6">
				<div class="absolute top-0 right-0">
					<div class="w-14 border-t border-sky-500 sm:w-24"></div>
					<div class="h-14 border-r border-sky-500 sm:h-24"></div>
				</div>
				<img
					class="rounded-lg shadow-xs transition-transform group-[:hover]:scale-110"
					src={Me}
					alt="Daniel Moretti"
					width="720"
					height="720"
				/>
				<div class="absolute bottom-0 left-0">
					<div class="h-14 border-l border-sky-500 sm:h-24"></div>
					<div class="w-14 border-b border-sky-500 sm:w-24"></div>
				</div>
			</figure>
		</div>
	</div>
</section>
