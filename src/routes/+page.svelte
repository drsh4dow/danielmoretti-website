<script lang="ts">
	import Hero from '$lib/hero/Hero.svelte';
	import AboutMe from '$lib/aboutMe/AboutMe.svelte';
	import WorkSection from '$lib/workSection/WorkSection.svelte';
	import ExperienceSection from '$lib/experienceSection/ExperienceSection.svelte';
	import Footer from '$lib/footer/Footer.svelte';
</script>

<svelte:head>
	<title>Daniel Moretti — Co-Founder & CTO at Mappa</title>
	<meta
		name="description"
		content="Daniel Moretti is Co-Founder & CTO of Mappa, building AI voice agents and production systems in Rust, TypeScript, and Python. Portfolio, experience, and writing."
	/>
	<meta property="og:title" content="Daniel Moretti — Co-Founder & CTO at Mappa" />
	<meta
		property="og:description"
		content="Daniel Moretti is Co-Founder & CTO of Mappa, building AI voice agents and production systems in Rust, TypeScript, and Python. Portfolio, experience, and writing."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://danielmoretti.com" />
	<meta property="og:image" content="https://danielmoretti.com/images/blog/terminal-survival.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://danielmoretti.com" />
</svelte:head>

<Hero />
<AboutMe />
<WorkSection />
<ExperienceSection />
<Footer />
