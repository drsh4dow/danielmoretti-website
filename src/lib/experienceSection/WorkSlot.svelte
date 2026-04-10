<script lang="ts">
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { activeNumber } from '$lib/stores';

	interface Props {
		title?: string;
		company?: string;
		since?: string;
		until?: string;
		id?: number;
		keypoints?: string[];
		techStack?: string;
	}

	let {
		title = '',
		company = '',
		since = '',
		until = '',
		id = 0,
		keypoints = [''],
		techStack = ''
	}: Props = $props();

	let isExpanded = $state(false);

	const unsubscribe = activeNumber.subscribe((val) => {
		isExpanded = val === id;
	});

	onDestroy(unsubscribe);

	function handleClick() {
		activeNumber.set(isExpanded ? null : id);
	}
</script>

<button
	type="button"
	onclick={handleClick}
	aria-expanded={isExpanded}
	class="mx-auto mb-2 flex w-full max-w-2xl cursor-pointer items-center justify-between rounded-lg bg-sky-600 px-2 py-4 text-left sm:px-6"
>
	<div class="flex items-center justify-start">
		<svg
			class=" mr-2 h-3 fill-slate-50 antialiased"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				class="custom-rotation-object transition-transform ease-in-out"
				class:rotate-90={isExpanded}
				x="38"
				y="0"
				ry="15"
				rx="10"
				width="25"
				height="100"
			/>
			<rect x="0" y="37" ry="10" rx="15" width="100" height="25" />
		</svg>
		<h3 class="text-lg font-bold whitespace-nowrap sm:text-xl">{title} {company}</h3>
	</div>
	<h3 class="hidden text-xl font-bold whitespace-nowrap sm:inline sm:text-xl">{since} - {until}</h3>
</button>

{#if isExpanded}
	<div
		transition:slide
		class="mx-auto mb-2 max-w-2xl rounded-lg border border-sky-500 px-4 py-4 sm:px-8"
	>
		<ul class="mb-4 list-outside text-base font-bold sm:text-lg md:text-xl">
			{#each keypoints as point}
				<li class="mb-2">&nbsp;{point}</li>
			{/each}
		</ul>
		<h4 class="text-base font-bold text-slate-200/75 sm:text-lg md:text-xl">{techStack}</h4>
	</div>
{/if}

<style>
	ul {
		list-style-type: '>';
	}

	.custom-rotation-object {
		transform-box: fill-box;
		transform-origin: center;
	}
</style>
