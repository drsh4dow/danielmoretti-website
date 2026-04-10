<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Header from '$lib/header/Header.svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<Header />
<div class="mx-auto max-w-screen-xl px-2 sm:px-4 md:px-6">
	{@render children?.()}
</div>
