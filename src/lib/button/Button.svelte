<script lang="ts">
	import type { Snippet } from 'svelte';
	import { horizontalSlide } from '$lib/util/horizontalSlide';

	let condition = $state(false);

	let { children }: { children?: Snippet } = $props();
</script>

<span
	role="presentation"
	onmouseenter={() => (condition = true)}
	onmouseleave={() => (condition = false)}
	class="group relative inline-flex items-center justify-center overflow-hidden rounded border-2 border-sky-500 px-4 py-2 sm:px-5 sm:py-3"
>
	{#if condition}
		<div
			transition:horizontalSlide={{ duration: 300, axis: 'x' }}
			class="absolute top-0 left-0 -z-10 h-full w-full bg-sky-500"
		></div>
	{/if}
	<h3 class="text-md font-black select-none group-hover:text-white sm:text-xl">
		{@render children?.()}
	</h3>
</span>
