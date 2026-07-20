<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<span
	role="presentation"
	class="group relative inline-flex items-center justify-center overflow-hidden rounded border-2 border-sky-500 px-4 py-2 sm:px-5 sm:py-3"
>
	<div
		class="absolute top-0 left-0 -z-10 h-full w-full -translate-x-full bg-sky-500 transition-transform duration-300 ease-out group-[:hover]:translate-x-0"
	></div>
	<span class="text-md font-black select-none group-[:hover]:text-white sm:text-xl">
		{@render children?.()}
	</span>
</span>
