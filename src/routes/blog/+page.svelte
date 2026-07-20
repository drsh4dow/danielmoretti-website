<script lang="ts">
	import BlogPostCard from '$lib/blogPostCard/BlogPostCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Daniel Moretti's Blog</title>
	<meta
		name="description"
		content="Daniel Moretti's blog about software engineering, TypeScript, Rust, AI agents, Linux, and developer tooling."
	/>
	<meta property="og:title" content="Daniel Moretti's Blog" />
	<meta
		property="og:description"
		content="Daniel Moretti's blog about software engineering, TypeScript, Rust, AI agents, Linux, and developer tooling."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://danielmoretti.com/blog" />
	<meta property="og:image" content="https://danielmoretti.com/images/blog/terminal-survival.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://danielmoretti.com/blog" />
</svelte:head>

<h1
	class="font-inter mb-10 pt-32 text-left text-3xl font-bold sm:text-4xl md:mb-20 md:text-5xl lg:text-6xl"
>
	Daniel Moretti's Blog
</h1>
<div class="md:border-l md:border-sky-500 md:pl-6">
	<div class="flex max-w-3xl flex-col gap-16">
		{#each data.posts as post (post.uid)}
			<BlogPostCard
				title={post.title}
				description={post.description}
				date={post.date}
				displayDate={post.displayDate}
				uid={post.uid}
			/>
		{:else}
			<p class="text-slate-300">No posts published yet.</p>
		{/each}
	</div>
</div>
