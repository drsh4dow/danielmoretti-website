<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Header from '$lib/header/Header.svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
	<meta name="author" content="Daniel Moretti" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
	<meta property="og:site_name" content="Daniel Moretti" />
	<meta property="og:locale" content="en_US" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Daniel Moretti's Blog"
		href="/blog/rss.xml"
	/>
	<link rel="me" href="https://github.com/drsh4dow" />
	<link rel="me" href="https://www.linkedin.com/in/dmorettiv" />
</svelte:head>

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
