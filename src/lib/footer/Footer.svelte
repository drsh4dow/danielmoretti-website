<script lang="ts">
	import Button from '$lib/button/Button.svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	let isInView = $state(false);
	const options: Options = {
		unobserveOnEnter: true,
		onChange: ({ inView }) => {
			isInView = inView;
		}
	};
</script>

<footer
	use:inview={options}
	class="transition-all delay-75 duration-700
	{isInView ? 'blur-0 translate-y-0 opacity-100' : '-translate-y-10 opacity-0 blur-md'}"
>
	<h1 class="font-inter mb-2 text-center text-5xl font-bold sm:mb-4 sm:text-7xl">Get in Touch</h1>
	<h3 class="mb-4 text-center text-lg font-bold text-slate-200/75 sm:mb-6 sm:text-2xl">
		Want to work together <br />or have some inquiries?
	</h3>
	<div class="mb-10 flex items-center justify-center">
		<a href="mailto:daniel.morettiv@gmail.com">
			<Button>Email Me</Button>
		</a>
	</div>
	<div class="mb-20 flex justify-center">
		<div class="flex items-center justify-center gap-4">
			<a
				class="text-base font-black text-slate-200/90 hover:text-slate-100 sm:text-xl"
				href="/resume.pdf"
				target="_blank">Resume</a
			>
			<div class="inline h-4 border border-slate-200/5"></div>
			<a
				class="text-base font-black text-slate-200/90 hover:text-slate-100 sm:text-xl"
				href="https://github.com/DrSh4dow"
				rel="noreferrer"
				target="_blank">Github</a
			>
			<div class="inline h-4 border border-slate-200/5"></div>
			<a
				class="text-base font-black text-slate-200/90 hover:text-slate-100 sm:text-xl"
				rel="noreferrer"
				href="https://www.linkedin.com/in/dmorettiv"
				target="_blank">LinkedIn</a
			>
		</div>
	</div>
	<h5 class="text-center text-xs font-black text-slate-200/20 sm:text-lg">
		Designed with <span class="text-red-500">&#10084;</span> and Coded with fun by Daniel Moretti
	</h5>
</footer>
