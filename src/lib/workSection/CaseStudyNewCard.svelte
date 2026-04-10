<script lang="ts">
	import Button from '$lib/button/Button.svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	interface Props {
		srcBg: string;
		altBg: string;
		srcLogo: string;
		altLogo: string;
		appType: string;
		appName: string;
		cardDirection: 'Left' | 'Right';
		classColor: string;
		href?: string;
		isExternal?: boolean;
		rel?: string;
		target?: string;
		buttonText?: string;
	}

	let isInView = $state(false);
	const options: Options = {
		rootMargin: '-80px',
		unobserveOnEnter: true,
		onChange: ({ inView }) => {
			isInView = inView;
		}
	};

	let {
		srcBg,
		altBg,
		srcLogo,
		altLogo,
		appType,
		appName,
		cardDirection,
		classColor,
		href = '.',
		isExternal = false,
		rel = '',
		target = '',
		buttonText = 'Case Study'
	}: Props = $props();
</script>

<article
	use:inview={options}
	class="flex max-w-5xl transition-all delay-75 duration-700
    {isInView ? 'blur-0 translate-y-0 opacity-100' : '-translate-y-1 opacity-0 blur-md'}"
>
	{#if cardDirection === 'Left'}
		<a
			{href}
			rel={rel || undefined}
			target={target || undefined}
			data-sveltekit-preload-data={isExternal ? 'off' : undefined}
			class="group relative block max-h-60 cursor-pointer overflow-hidden rounded-2xl shadow-md sm:max-h-[360px]"
		>
			<div
				class="absolute top-0 left-0 flex h-full w-full items-center justify-center transition-all duration-700 group-hover:bg-slate-500/10 {classColor}"
			>
				<img
					class="blur-0 opacity-100 transition-all duration-500 group-hover:scale-125 group-hover:opacity-0 group-hover:blur-lg"
					src={srcLogo}
					alt={altLogo}
				/>
			</div>
			<img src={srcBg} alt={altBg} />
		</a>
		<div class="hidden w-[520px] p-10 lg:block">
			<h4 class="text-2xl font-black">{appType}</h4>
			<h2 class="font-inter mb-4 text-4xl font-bold">{appName}</h2>
			<h3 class="mb-10 text-2xl font-black text-slate-200">Design & Development</h3>
			<div class="flex items-center justify-start">
				<a
					{href}
					rel={rel || undefined}
					target={target || undefined}
					data-sveltekit-preload-data={isExternal ? 'off' : undefined}
				>
					<Button>{buttonText}</Button>
				</a>
			</div>
		</div>
	{:else}
		<div class="hidden w-[520px] p-10 lg:block">
			<h4 class="text-right text-2xl font-black">{appType}</h4>
			<h2 class="font-inter mb-4 text-right text-4xl font-bold">{appName}</h2>
			<h3 class="mb-10 text-right text-2xl font-black text-slate-200">Design & Development</h3>
			<div class="flex items-center justify-end">
				<a
					{href}
					rel={rel || undefined}
					target={target || undefined}
					data-sveltekit-preload-data={isExternal ? 'off' : undefined}
				>
					<Button>{buttonText}</Button>
				</a>
			</div>
		</div>
		<a
			{href}
			rel={rel || undefined}
			target={target || undefined}
			data-sveltekit-preload-data={isExternal ? 'off' : undefined}
			class="group relative block max-h-[360px] cursor-pointer overflow-hidden rounded-2xl shadow-md"
		>
			<div
				class="absolute top-0 left-0 flex h-full w-full items-center justify-center transition-all duration-700 group-hover:bg-slate-500/10 {classColor}"
			>
				<img
					class="blur-0 opacity-100 transition-all duration-500 group-hover:opacity-0 group-hover:blur-lg"
					src={srcLogo}
					alt={altLogo}
				/>
			</div>
			<img src={srcBg} alt={altBg} />
		</a>
	{/if}
</article>
