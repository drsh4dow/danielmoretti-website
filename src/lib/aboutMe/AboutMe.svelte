<script lang="ts">
	import Me from './me.jpg';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	let isInView = $state(false);
	const options: Options = {
		rootMargin: '-80px',
		unobserveOnEnter: true,
		onChange: ({ inView }) => {
			isInView = inView;
		}
	};
</script>

<section
	use:inview={options}
	class="my-20 grid grid-cols-1 justify-between gap-10 overflow-hidden transition-all delay-75 duration-700 sm:my-40 md:grid-cols-2 lg:mb-60
	{isInView ? 'blur-0 translate-x-0 opacity-100' : 'translate-x-4 opacity-0 blur-md'}"
	id="about-me-section"
>
	<div>
		<div class="mb-10 flex items-center sm:mb-14">
			<h2 class=" font-inter pr-6 text-3xl font-bold whitespace-nowrap sm:text-5xl">About Me</h2>
			<div class="h-px w-full bg-sky-500"></div>
		</div>
		<p class="text-justify text-base text-slate-200 sm:text-xl">
			I'm Daniel, a Full-Stack Software Developer passionate about Open-Source, Linux and Music
			&#9835;. I believe that through the creation of apps, we deliver experiences that empower
			users to change how they interact with their lives, so by the same principle, I want to
			deliver the bests experiences I can give.
		</p>
		<p class="py-4 text-justify text-base text-slate-200 sm:text-xl">
			My journey as a Developer began in 2015 when I was trying to start a little business; back
			then, we needed a website and had no knowledge of creating one. Sure, we could make use of
			some developer-free tooling, but Nah, I wanted to make something highly customizable to fit in
			perfection the idea we had, so I started learning HTML, CSS, and JavaScript.
		</p>
		<p class="text-justify text-base text-slate-200 sm:text-xl">
			Little did I know that from that day on, I would fall in love and keep digging into a
			neverending hole of knowledge and challenges.
		</p>
	</div>
	<div class="flex items-start justify-center md:justify-end md:pt-28">
		<div class="group">
			<figure class=" relative w-60 p-4 transition-transform group-hover:scale-95 sm:w-96 sm:p-6">
				<div class="absolute top-0 right-0">
					<div class="w-14 border-t border-sky-500 sm:w-24"></div>
					<div class="h-14 border-r border-sky-500 sm:h-24"></div>
				</div>
				<img
					class="rounded-lg shadow-xs transition-transform group-hover:scale-110"
					src={Me}
					alt="Daniel Moretti"
				/>
				<div class="absolute bottom-0 left-0">
					<div class="h-14 border-l border-sky-500 sm:h-24"></div>
					<div class="w-14 border-b border-sky-500 sm:w-24"></div>
				</div>
			</figure>
		</div>
	</div>
</section>
