<script lang="ts">
	import * as prismicH from '@prismicio/helpers';
	import type { PageData } from './$types';
	import { leftArrowData } from '$lib/util/constants';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.document.data.title[0].text} | Daniel Moretti's Blog</title>
	<meta name="description" content={data.document.data.introduction[0].text} />
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
	<h1 class="font-inter mb-4 text-left text-3xl font-bold sm:text-4xl md:mb-8 md:text-5xl">
		{data.document.data.title[0].text}
	</h1>
	<h5 class="mb-10 text-lg font-bold text-slate-300 sm:text-xl">
		{data.document.data.introduction[0].text}
	</h5>
	<div class="mb-20 max-w-2xl overflow-hidden rounded-xl shadow">
		<img
			class="h-auto w-full object-contain"
			src={data.document.data.bannerpic.url}
			alt={data.document.data.bannerpic.alt}
		/>
		<p class="text-sm text-slate-500 [&>a]:underline">
			{@html data.document.data.bannerpic.copyright}
		</p>
	</div>
	<div
		class="[&>*]:text-lg [&>*]:text-slate-200 [&>h1]:mb-2 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-slate-50 [&>h2]:mb-2 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-50 [&>h3]:mb-2 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-50 [&>h6]:px-1 [&>h6]:text-sm [&>h6]:text-slate-400 [&>h6]:italic [&>p]:mb-16 [&>pre]:-mt-10 [&>pre]:mb-6 [&>pre]:overflow-x-scroll [&>pre]:rounded-xl [&>pre]:bg-black [&>pre]:p-4 [&>pre]:text-base [&>pre]:text-green-500 [&>ul]:-mt-10 [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:px-8"
	>
		{@html prismicH.asHTML(data.document.data.body)}
	</div>
</article>
<h5 class="text-center text-xs font-black text-slate-200/20 sm:text-lg">
	Designed with <span class="text-red-500">&#10084;</span> and Coded with fun by Daniel Moretti
</h5>
