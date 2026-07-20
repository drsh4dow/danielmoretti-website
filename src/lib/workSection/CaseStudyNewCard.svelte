<script lang="ts">
	import { onMount } from 'svelte';
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

	let mounted = $state(false);
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
		href,
		isExternal = false,
		rel,
		target,
		buttonText = 'Case Study'
	}: Props = $props();

	onMount(() => {
		mounted = true;
	});
</script>

{#snippet cardImage()}
	<div
		class="absolute top-0 left-0 flex h-full w-full items-center justify-center transition-colors duration-300 ease-out group-focus-visible:bg-slate-500/10 group-[:hover]:bg-slate-500/10 {classColor}"
	>
		<img
			class="opacity-100 transition-[opacity,transform,filter] duration-300 ease-out group-focus-visible:scale-110 group-focus-visible:opacity-0 group-focus-visible:blur-sm group-[:hover]:scale-110 group-[:hover]:opacity-0 group-[:hover]:blur-sm"
			src={srcLogo}
			alt={altLogo}
		/>
	</div>
	<img src={srcBg} alt={altBg} width="508" height="312" loading="lazy" decoding="async" />
{/snippet}

<article
	use:inview={options}
	class="flex max-w-5xl transition-[opacity,transform] delay-75 duration-500 ease-out
		{mounted && !isInView ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}"
>
	{#if cardDirection === 'Left'}
		{#if href}
			<a
				{href}
				{rel}
				{target}
				data-sveltekit-preload-data={isExternal ? 'off' : undefined}
				class="group relative block max-h-60 cursor-pointer overflow-hidden rounded-2xl shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 sm:max-h-[360px]"
			>
				{@render cardImage()}
			</a>
		{:else}
			<div
				class="group relative block max-h-60 overflow-hidden rounded-2xl shadow-md sm:max-h-[360px]"
			>
				{@render cardImage()}
			</div>
		{/if}
		<div class="hidden w-[520px] p-10 lg:block">
			<h3 class="text-2xl font-black">{appType}</h3>
			<h2 class="font-inter mb-4 text-4xl font-bold">{appName}</h2>
			<h3 class="mb-10 text-2xl font-black text-slate-200">Design & Development</h3>
			{#if href}
				<div class="flex items-center justify-start">
					<a
						{href}
						{rel}
						{target}
						data-sveltekit-preload-data={isExternal ? 'off' : undefined}
						class="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
					>
						<Button>{buttonText}</Button>
					</a>
				</div>
			{/if}
		</div>
	{:else}
		<div class="hidden w-[520px] p-10 lg:block">
			<h3 class="text-right text-2xl font-black">{appType}</h3>
			<h2 class="font-inter mb-4 text-right text-4xl font-bold">{appName}</h2>
			<h3 class="mb-10 text-right text-2xl font-black text-slate-200">Design & Development</h3>
			{#if href}
				<div class="flex items-center justify-end">
					<a
						{href}
						{rel}
						{target}
						data-sveltekit-preload-data={isExternal ? 'off' : undefined}
						class="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
					>
						<Button>{buttonText}</Button>
					</a>
				</div>
			{/if}
		</div>
		{#if href}
			<a
				{href}
				{rel}
				{target}
				data-sveltekit-preload-data={isExternal ? 'off' : undefined}
				class="group relative block max-h-[360px] cursor-pointer overflow-hidden rounded-2xl shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
			>
				{@render cardImage()}
			</a>
		{:else}
			<div class="group relative block max-h-[360px] overflow-hidden rounded-2xl shadow-md">
				{@render cardImage()}
			</div>
		{/if}
	{/if}
</article>
