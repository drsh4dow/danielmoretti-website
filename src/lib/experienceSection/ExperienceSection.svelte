<script lang="ts">
	import WorkSlot from './WorkSlot.svelte';
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
	class="mb-28 transition-all delay-75 duration-700 md:mb-40 lg:mb-60
	{isInView ? 'blur-0 translate-x-0 translate-y-0 opacity-100' : 'translate-y-10 opacity-0 blur-md'} "
>
	<div class="mb-12 flex items-center justify-center sm:mb-14 lg:mb-20 lg:px-6">
		<div class="h-px w-full bg-sky-500"></div>
		<h2 class="font-inter px-6 text-3xl font-bold whitespace-nowrap sm:text-5xl">
			Professional Experience
		</h2>
		<div class="h-px w-full bg-sky-500"></div>
	</div>
	<div>
		<WorkSlot
			id={1}
			keypoints={[
				'Help to analyze software engineering work and give feedback.',
				'Worked and analyzed multiple codebases developed by engineers of different levels.'
			]}
			title="Software Engineer"
			company="@ Woven Teams"
			since="2022"
			until="Present"
			techStack="JS/TS | C# | Java | Go | Slack"
		/>
		<WorkSlot
			id={2}
			title="System Administrator"
			company="@ Dar Spa"
			since="2020"
			until="2022"
			keypoints={[
				'Managed and maintained in-house systems.',
				'Developed custom tooling and email server.',
				'Developed and Designed the public-facing Website for Dar Spa. '
			]}
			techStack="Linux | Dovecot | Svelte | Node | Ngnix | Git"
		/>
		<WorkSlot
			id={3}
			keypoints={[
				'Found multiple vulnerabilities and helped to fix them.',
				'Crawl information disclosure through source code.',
				'Created automation tools in Bash.'
			]}
			title="Bug Bounty Hunter"
			company="@ HackerOne"
			since="2019"
			until="2021"
			techStack="Burp Suite | Javascript | Networking | Bash"
		/>
		<WorkSlot
			keypoints={[
				'Developed and Designed multiple public-facing Websites for different kinds of clients.',
				'Developed and Maintained Web Applications concerning healthcare administration.',
				'Created custom in-house software.'
			]}
			techStack="Svelte | React | Typescript | Figma | Git"
			id={4}
			title="Freelance Web Developer"
			since="2017"
			until="Present"
		/>
	</div>
</section>
