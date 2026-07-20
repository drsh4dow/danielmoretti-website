<script lang="ts">
	import { onMount } from 'svelte';
	import WorkSlot from './WorkSlot.svelte';
	import { inview } from '$lib/util/inview';
	import type { Options } from '$lib/types';

	let activeId = $state<number | null>(null);
	let isInView = $state(false);
	let mounted = $state(false);

	const options: Options = {
		rootMargin: '-80px',
		unobserveOnEnter: true,
		onChange: ({ inView }) => {
			isInView = inView;
		}
	};

	onMount(() => {
		mounted = true;
	});
</script>

<section
	use:inview={options}
	class="mb-28 transition-[opacity,transform] duration-500 ease-out md:mb-40 lg:mb-60
	{mounted && !isInView ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}"
>
	<div class="mb-12 flex items-center justify-center sm:mb-14 lg:mb-20 lg:px-6">
		<div class="h-px w-full bg-sky-500"></div>
		<h2
			class="font-inter px-6 text-center text-3xl font-bold whitespace-normal sm:text-5xl sm:whitespace-nowrap"
		>
			Professional Experience
		</h2>
		<div class="h-px w-full bg-sky-500"></div>
	</div>
	<div>
		<WorkSlot
			id={1}
			expanded={activeId === 1}
			ontoggle={() => (activeId = activeId === 1 ? null : 1)}
			title="Co-Founder & CTO"
			company="@ Mappa"
			since="2023"
			until="2026"
			keypoints={[
				'Built a voice-AI platform analyzing recruitment interviews for 100+ SMB & enterprise clients across the Americas, from first commit onward.',
				'Voice pipeline end-to-end: Deepgram STT → LLM analysis → structured reports, 100+ interviews/day in production.',
				'Agent orchestration on the Vercel AI SDK with tool use, retries, and structured outputs, gated by hundreds of eval cases.',
				'Led the event-driven TypeScript + Rust backend (Postgres, Temporal) as the largest code contributor.',
				'Client impact: hiring cycles cut by 300+ hours and ~$30k per role.'
			]}
			techStack="Rust | TypeScript | Python | Postgres | Temporal | Vercel AI SDK"
		/>
		<WorkSlot
			id={2}
			expanded={activeId === 2}
			ontoggle={() => (activeId = activeId === 2 ? null : 2)}
			title="Independent Engineer"
			company="@ Upwork"
			since="2017"
			until="2023"
			keypoints={[
				'Six years of solo-owned production web apps for clients across industries.',
				'Built and maintained healthcare-administration systems used daily by clinical staff.',
				'Owned everything: design, development, deployment, and support.'
			]}
			techStack="TypeScript | Svelte | React | Node | Figma | Linux"
		/>
		<WorkSlot
			id={3}
			expanded={activeId === 3}
			ontoggle={() => (activeId = activeId === 3 ? null : 3)}
			title="Software Engineer"
			company="@ Woven"
			since="2019"
			until="2023"
			keypoints={[
				'Assessed software-engineering work across seniority levels for US hiring pipelines.',
				'Reviewed and scored real-world codebases in multiple languages.'
			]}
			techStack="JS/TS | C# | Java | Go"
		/>
		<WorkSlot
			id={4}
			expanded={activeId === 4}
			ontoggle={() => (activeId = activeId === 4 ? null : 4)}
			title="Bug Bounty Hunter"
			company="@ HackerOne"
			since="2019"
			until="2021"
			keypoints={[
				'Reported multiple valid vulnerabilities on live targets.',
				'Built automation tooling for recon in Bash.'
			]}
			techStack="Burp Suite | JavaScript | Networking | Bash"
		/>
	</div>
</section>
