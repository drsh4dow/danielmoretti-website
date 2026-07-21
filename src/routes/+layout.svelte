<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Header from '$lib/header/Header.svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-white"
>
	Skip to content
</a>
<Header />
<main id="main-content" class="mx-auto max-w-screen-xl overflow-x-clip px-2 sm:px-4 md:px-6">
	{@render children?.()}
</main>
