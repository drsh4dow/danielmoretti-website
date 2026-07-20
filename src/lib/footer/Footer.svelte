<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/button/Button.svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	let mounted = $state(false);
	let isInView = $state(false);
	const options: Options = {
		unobserveOnEnter: true,
		onChange: ({ inView }) => {
			isInView = inView;
		}
	};

	onMount(() => {
		mounted = true;
	});
</script>

<footer
	use:inview={options}
	class="transition-[opacity,transform] duration-500 ease-out
	{mounted && !isInView ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}"
>
	<h2 class="font-inter mb-2 text-center text-5xl font-bold sm:mb-4 sm:text-7xl">Get in Touch</h2>
	<p class="mb-4 text-center text-lg font-bold text-slate-200/75 sm:mb-6 sm:text-2xl">
		Want to work together <br />or have some inquiries?
	</p>
	<div class="mb-10 flex items-center justify-center">
		<a href="mailto:daniel.morettiv@gmail.com">
			<Button>Email Me</Button>
		</a>
	</div>
	<div class="mb-20 flex justify-center">
		<div class="flex items-center justify-center gap-4">
			<a
				class="-my-2.5 inline-flex min-h-11 items-center text-base font-black text-slate-200/90 hover:text-slate-100 sm:-my-2 sm:text-xl"
				href="/resume.pdf"
				target="_blank">Resume</a
			>
			<div class="inline h-4 border border-slate-200/5"></div>
			<a
				class="-my-2.5 inline-flex min-h-11 items-center text-base font-black text-slate-200/90 hover:text-slate-100 sm:-my-2 sm:text-xl"
				href="https://github.com/drsh4dow"
				rel="noreferrer"
				target="_blank">Github</a
			>
			<div class="inline h-4 border border-slate-200/5"></div>
			<a
				class="-my-2.5 inline-flex min-h-11 items-center text-base font-black text-slate-200/90 hover:text-slate-100 sm:-my-2 sm:text-xl"
				rel="noreferrer"
				href="https://www.linkedin.com/in/dmorettiv"
				target="_blank">LinkedIn</a
			>
		</div>
	</div>
	<p class="text-center text-xs font-black text-slate-200/60 sm:text-lg">
		Designed with <span class="text-red-500">&#10084;</span> and Coded with fun by Daniel Moretti
	</p>
</footer>
