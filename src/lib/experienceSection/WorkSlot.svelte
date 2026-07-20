<script lang="ts">
	import { slide } from 'svelte/transition';

	interface Props {
		title: string;
		company: string;
		since: string;
		until: string;
		id: number;
		keypoints: string[];
		techStack: string;
		expanded: boolean;
		ontoggle: () => void;
	}

	let { title, company, since, until, id, keypoints, techStack, expanded, ontoggle }: Props =
		$props();

	let triggerId = $derived(`work-slot-trigger-${id}`);
	let panelId = $derived(`work-slot-panel-${id}`);
</script>

<button
	id={triggerId}
	type="button"
	onclick={ontoggle}
	aria-expanded={expanded}
	aria-controls={panelId}
	class="mx-auto mb-2 flex w-full max-w-2xl cursor-pointer items-center justify-between rounded-lg bg-sky-700 px-2 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:px-6"
>
	<span class="flex min-w-0 items-center justify-start">
		<svg
			class="mr-2 h-3 shrink-0 fill-slate-50 antialiased"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				class="custom-rotation-object transition-transform duration-[250ms] ease-out"
				class:rotate-90={expanded}
				x="38"
				y="0"
				ry="15"
				rx="10"
				width="25"
				height="100"
			/>
			<rect x="0" y="37" ry="10" rx="15" width="100" height="25" />
		</svg>
		<span class="min-w-0">
			<span class="block text-lg font-bold sm:text-xl">{title} {company}</span>
			<span class="block text-sm font-bold text-slate-100/80 sm:hidden">{since}–{until}</span>
		</span>
	</span>
	<span class="ml-4 hidden shrink-0 text-xl font-bold whitespace-nowrap sm:inline">
		{since}–{until}
	</span>
</button>

{#if expanded}
	<div
		id={panelId}
		role="region"
		aria-labelledby={triggerId}
		transition:slide={{ duration: 250 }}
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
