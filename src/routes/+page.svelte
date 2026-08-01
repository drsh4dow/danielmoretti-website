<script lang="ts">
	import Hero from '$lib/hero/Hero.svelte';
	import AboutMe from '$lib/aboutMe/AboutMe.svelte';
	import WorkSection from '$lib/workSection/WorkSection.svelte';
	import ExperienceSection from '$lib/experienceSection/ExperienceSection.svelte';
	import Footer from '$lib/footer/Footer.svelte';

	const title = 'Daniel Moretti | Senior Product Engineer';
	const description =
		'Daniel Moretti is a Chile-based senior product engineer and former co-founder/CTO with 10+ years building production software, AI agents, and developer tooling.';
	const structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'ProfilePage',
				'@id': 'https://danielmoretti.com/#profile',
				url: 'https://danielmoretti.com/',
				name: title,
				description,
				inLanguage: 'en',
				mainEntity: { '@id': 'https://danielmoretti.com/#daniel-moretti' }
			},
			{
				'@type': 'Person',
				'@id': 'https://danielmoretti.com/#daniel-moretti',
				name: 'Daniel Moretti',
				givenName: 'Daniel',
				familyName: 'Moretti',
				url: 'https://danielmoretti.com/',
				image: [
					'https://danielmoretti.com/images/profile/daniel-moretti.jpg',
					'https://danielmoretti.com/images/profile/daniel-moretti-4x3.jpg',
					'https://danielmoretti.com/images/profile/daniel-moretti-16x9.jpg'
				],
				jobTitle: 'Senior Product Engineer',
				description,
				homeLocation: { '@type': 'Country', name: 'Chile' },
				knowsAbout: [
					'Product engineering',
					'Rust',
					'TypeScript',
					'Python',
					'AI agents',
					'PostgreSQL',
					'Linux',
					'Software security'
				],
				sameAs: ['https://github.com/drsh4dow', 'https://www.linkedin.com/in/dmorettiv']
			},
			{
				'@type': 'WebSite',
				'@id': 'https://danielmoretti.com/#website',
				url: 'https://danielmoretti.com/',
				name: 'Daniel Moretti',
				description: "Daniel Moretti's portfolio and software engineering blog",
				inLanguage: 'en',
				publisher: { '@id': 'https://danielmoretti.com/#daniel-moretti' }
			}
		]
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content="https://danielmoretti.com/" />
	<meta
		property="og:image"
		content="https://danielmoretti.com/images/profile/daniel-moretti-16x9.jpg"
	/>
	<meta property="og:image:alt" content="Daniel Moretti, Senior Product Engineer" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="profile:first_name" content="Daniel" />
	<meta property="profile:last_name" content="Moretti" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta
		name="twitter:image"
		content="https://danielmoretti.com/images/profile/daniel-moretti-16x9.jpg"
	/>
	<link rel="canonical" href="https://danielmoretti.com/" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<Hero />
<AboutMe />
<WorkSection />
<ExperienceSection />
<Footer />
