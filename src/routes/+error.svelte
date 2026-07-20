<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | Daniel Moretti</title>
</svelte:head>

<section class="flex min-h-screen items-center justify-center py-24">
	<div class="w-full max-w-2xl border-l border-sky-500 pl-6 sm:pl-10">
		<p class="font-inter mb-4 text-sm font-bold tracking-[0.3em] text-sky-500 uppercase">
			Error {page.status}
		</p>
		{#if page.status === 404}
			<h1 class="font-inter max-w-xl text-4xl font-bold sm:text-6xl">
				You are far beyond safety, adventurer
			</h1>
			<nav class="mt-10 flex gap-6" aria-label="Error page navigation">
				<a
					href="/"
					data-sveltekit-preload-data
					class="font-bold text-sky-500 hover:text-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
				>
					Home
				</a>
				<a
					href="/blog"
					data-sveltekit-preload-data
					class="font-bold text-sky-500 hover:text-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
				>
					Blog
				</a>
			</nav>
		{:else}
			<h1 class="font-inter max-w-xl text-4xl font-bold sm:text-6xl">Something went wrong</h1>
			<a
				href="/"
				data-sveltekit-preload-data
				class="mt-10 inline-block font-bold text-sky-500 hover:text-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
			>
				Home
			</a>
		{/if}
	</div>
</section>
