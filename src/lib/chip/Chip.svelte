<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface Props {
		index: number;
		chipClass?: string;
		children?: Snippet;
	}

	let { index, chipClass = 'bg-indigo-600', children }: Props = $props();
</script>

<div
	in:fly={{
		x: 40,
		y: -40,
		delay: Math.min(150 + 60 * index, 600),
		easing: quintOut,
		duration: 400
	}}
	class={`inline-flex items-center justify-center rounded ${chipClass} px-2 py-1 shadow sm:px-4 sm:py-2`}
>
	<h3 class="text-base font-black sm:text-lg lg:text-lg">{@render children?.()}</h3>
</div>
