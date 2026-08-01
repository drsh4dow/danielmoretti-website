<script lang="ts">
	import BlogPostCard from '$lib/blogPostCard/BlogPostCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const title = "Daniel Moretti's Software Engineering Blog";
	const description =
		'Daniel Moretti writes about software engineering, TypeScript, Rust, AI agents, Linux, and developer tooling.';
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': 'https://danielmoretti.com/blog#blog',
		url: 'https://danielmoretti.com/blog',
		name: title,
		description,
		inLanguage: 'en',
		author: {
			'@type': 'Person',
			'@id': 'https://danielmoretti.com/#daniel-moretti',
			name: 'Daniel Moretti',
			url: 'https://danielmoretti.com/'
		},
		blogPost: data.posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: `https://danielmoretti.com/blog/${post.uid}`,
			datePublished: post.date,
			dateModified: post.updated,
			author: { '@id': 'https://danielmoretti.com/#daniel-moretti' }
		}))
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://danielmoretti.com/blog" />
	<meta
		property="og:image"
		content="https://danielmoretti.com/images/profile/daniel-moretti-16x9.jpg"
	/>
	<meta property="og:image:alt" content="Daniel Moretti, Senior Product Engineer" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta
		name="twitter:image"
		content="https://danielmoretti.com/images/profile/daniel-moretti-16x9.jpg"
	/>
	<link rel="canonical" href="https://danielmoretti.com/blog" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`}
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
