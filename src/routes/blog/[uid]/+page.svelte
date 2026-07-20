<script lang="ts">
	import { leftArrowData } from '$lib/util/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.post.title} | Daniel Moretti's Blog</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href={`https://danielmoretti.com/blog/${data.post.uid}`} />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	{#if data.post.banner}
		<meta property="og:image" content={`https://danielmoretti.com${data.post.banner}`} />
	{/if}
</svelte:head>

<article class="mb-20 max-w-screen-md pt-16 sm:pt-20">
	<div class="flex w-full py-10">
		<a href="/blog" aria-label="Back to blog" data-sveltekit-preload-data>
			<svg
				class="cursor-pointer"
				width="52"
				height="52"
				viewBox="0 0 52 52"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="26" cy="26" r="25.5" stroke="#0EA5E9" />
				<path d={leftArrowData} fill="#0EA5E9" />
			</svg>
		</a>
	</div>
	<h1 class="font-inter mb-4 text-left text-3xl font-bold sm:text-4xl md:text-5xl">
		{data.post.title}
	</h1>
	<p class="mb-4 text-lg font-bold text-slate-300 sm:text-xl">
		{data.post.description}
	</p>
	<time class="mb-10 block text-sm text-sky-400" datetime={data.post.date}>
		{data.post.displayDate}
	</time>
	{#if data.post.banner}
		<div class="mb-20 max-w-2xl overflow-hidden rounded-xl shadow">
			<img
				class="h-auto w-full object-contain"
				src={data.post.banner}
				alt={data.post.bannerAlt ?? data.post.title}
				width="1200"
				height="630"
			/>
			{#if data.post.bannerCredit}
				<p class="px-1 py-2 text-sm text-slate-500 [&_a]:text-sky-400 [&_a]:underline">
					{@html data.post.bannerCredit}
				</p>
			{/if}
		</div>
	{/if}
	<div
		class="[&>h1]:font-inter [&>h2]:font-inter [&>h3]:font-inter [&>h4]:font-inter [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-slate-800 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:text-sky-300 [&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-4 [&_li>p]:mb-2 [&>*]:text-base [&>*]:text-slate-200 sm:[&>*]:text-lg [&>blockquote]:mb-6 [&>blockquote]:border-l-2 [&>blockquote]:border-sky-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote>p]:mb-0 [&>h1]:mt-12 [&>h1]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-slate-50 [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-50 [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-50 [&>h4]:mt-8 [&>h4]:mb-4 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-slate-50 [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-8 [&>p]:mb-6 [&>p]:leading-8 [&>pre]:mb-6 [&>pre]:overflow-x-auto [&>pre]:rounded-xl [&>pre]:p-4 [&>pre]:text-sm sm:[&>pre]:text-base [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-8"
	>
		{@html data.post.html}
	</div>
</article>
<h5 class="text-center text-xs font-black text-slate-200/20 sm:text-lg">
	Designed with <span class="text-red-500">&#10084;</span> and Coded with fun by Daniel Moretti
</h5>
