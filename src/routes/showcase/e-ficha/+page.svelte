<script lang="ts">
	import CaseStudy from '$lib/caseStudy/CaseStudy.svelte';

	const title = 'E-Ficha Case Study | Daniel Moretti';
	const description =
		'Daniel Moretti built E-Ficha, a medical administration platform for scheduling, patient history, prescriptions, and PDF generation.';
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		'@id': 'https://danielmoretti.com/showcase/e-ficha#case-study',
		url: 'https://danielmoretti.com/showcase/e-ficha',
		name: 'E-Ficha case study',
		description,
		inLanguage: 'en',
		creator: {
			'@type': 'Person',
			'@id': 'https://danielmoretti.com/#daniel-moretti',
			name: 'Daniel Moretti',
			url: 'https://danielmoretti.com/'
		},
		keywords: ['Healthcare software', 'Medical administration', 'Scheduling', 'PDF generation']
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://danielmoretti.com/showcase/e-ficha" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://danielmoretti.com/showcase/e-ficha" />
	<meta property="og:image" content="https://danielmoretti.com/images/eficha/eficha-social.jpg" />
	<meta property="og:image:alt" content="E-Ficha medical administration platform" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://danielmoretti.com/images/eficha/eficha-social.jpg" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<CaseStudy />
