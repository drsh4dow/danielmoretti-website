<script lang="ts">
	import { leftArrowData } from '$lib/util/constants';
	import { blur } from 'svelte/transition';
	import Chip from '$lib/chip/Chip.svelte';
	import Button from '$lib/button/Button.svelte';

	interface ExtraPicture {
		header: string;
		src: string;
		alt: string;
	}

	interface Props {
		techs?: string[];
		title?: string;
		appType?: string[];
		mockupSrc?: string;
		mockupAlt?: string;
		techClass?: string;
		liveUrl?: string;
		hasLiveVersion?: boolean;
		description?: string;
		extraPictures?: ExtraPicture[];
	}

	let {
		techs = ['React', 'TypeScript', 'Express.js', 'HTML', 'CSS', 'GCP', 'Firebase'],
		title = 'E-Ficha',
		appType = ['Web', 'Application'],
		mockupSrc = '/images/eficha/mockup.png',
		mockupAlt = 'mockup of e-ficha web application',
		techClass = 'bg-indigo-600',
		liveUrl = '',
		hasLiveVersion = false,
		description = 'This project empowers doctors to have all the tools they need ranging from medical history, patient administration, scheduler, recipe generation, statistical generation, and AI-assisted writing in one place and with multi-platform support.',
		extraPictures = [
			{
				header: 'Intuitive UI for patient-management',
				src: '/images/eficha/patients.png',
				alt: 'patients dashboard'
			},
			{
				header: 'Multiline autocompletion inspired by Intellisense',
				src: '/images/eficha/autocompletion.png',
				alt: 'patients creation page showing autocompletion capabilities'
			},
			{
				header: 'Straightforward UI with a utility-first approach for doctors',
				src: '/images/eficha/medhistory.png',
				alt: 'medical history management'
			},
			{
				header: 'Recipe generation with on-the-fly pdf rendering',
				src: '/images/eficha/recipe.png',
				alt: 'on-the-fly pdf rendering'
			},
			{
				header: 'Powerful scheduler plus Google Calendar integration',
				src: '/images/eficha/scheduler.png',
				alt: 'Scheduler for e-ficha'
			},
			{
				header: 'Themes can never be left out &#10084;',
				src: '/images/eficha/themes.png',
				alt: 'theming'
			}
		]
	}: Props = $props();
</script>

<div
	class="absolute top-0 -z-10 hidden h-screen w-screen backdrop-blur-2xl lg:-left-10 lg:block"
></div>
<section class="relative mb-20">
	<div
		class="bg-gradient-radial absolute -top-64 -left-20 -z-20 hidden h-[800px] w-96 -rotate-[30deg] rounded-full lg:inline"
	></div>
	<div class="flex w-full py-10">
		<a
			in:blur={{ amount: 10, duration: 400 }}
			href="/#work-section"
			aria-label="Back to work section"
			data-sveltekit-preload-data
		>
			<svg
				class="cursor-pointer"
				width="52"
				height="52"
				viewBox="0 0 52 52"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="26" cy="26" r="25.5" stroke="#0EA5E9" />
				<path d={leftArrowData} fill="#0EA5E9" />
			</svg>
		</a>
	</div>
	<div class="mb-10 grid sm:mb-20 lg:grid-cols-2">
		<div class="lg:pt-4">
			<h3 in:blur={{ amount: 10, delay: 0, duration: 400 }} class="text-2xl font-black sm:mb-1">
				{appType.join(' ')}
			</h3>
			<h1
				in:blur={{ amount: 10, delay: 100, duration: 400 }}
				class={`font-inter text-7xl font-bold sm:text-8xl ${hasLiveVersion ? 'mb-6 lg:mb-10' : ''}`}
			>
				{title}
			</h1>
			{#if hasLiveVersion}
				<a
					in:blur={{ amount: 10, delay: 200, duration: 400 }}
					href={liveUrl}
					rel="noreferrer"
					target="_blank"
				>
					<Button>View Live</Button>
				</a>
			{/if}
		</div>
		<img
			in:blur={{ amount: 10, delay: 200, duration: 400 }}
			class="hidden lg:inline"
			src={mockupSrc}
			alt={mockupAlt}
		/>
	</div>
	<div
		in:blur={{ amount: 10, delay: 300, duration: 400 }}
		class="grid gap-5 sm:gap-10 lg:grid-cols-2"
	>
		<div>
			<h5 class="mb-2 text-2xl font-black sm:mb-6">Project Overview</h5>
			<p class="max-w-lg text-lg text-slate-200">
				{description}
			</p>
		</div>
		<div>
			<h5 class="mb-2 text-2xl font-black sm:mb-6">Tech & Tools Used</h5>
			<div class="flex max-w-md flex-wrap gap-2">
				{#each techs as tech, i}
					<Chip chipClass={techClass} index={i}>{tech}</Chip>
				{/each}
			</div>
		</div>
	</div>
</section>
<section in:blur={{ amount: 10, delay: 400, duration: 400 }} class="mb-10 flex flex-wrap gap-10">
	{#each extraPictures as { header, src, alt }}
		<div>
			<h5 class="mb-2 text-xl font-bold">{@html header}</h5>
			<img class="rounded-lg shadow" {src} {alt} loading="lazy" decoding="async" />
		</div>
	{/each}
</section>

<h5 class="text-center text-xs font-black text-slate-200/60 sm:text-lg">
	Designed with <span class="text-red-500">&#10084;</span> and Coded with fun by Daniel Moretti
</h5>
