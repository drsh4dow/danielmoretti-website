<script lang="ts">
	import CaseStudy from '$lib/caseStudy/CaseStudy.svelte';

	const title = 'DarSpa Case Study | Daniel Moretti';
	const description =
		'Daniel Moretti designed and built the DarSpa healthcare center website with Next.js, TypeScript, tRPC, and Prismic.';
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		'@id': 'https://danielmoretti.com/showcase/darspa#case-study',
		url: 'https://danielmoretti.com/showcase/darspa',
		name: 'DarSpa case study',
		description,
		inLanguage: 'en',
		creator: {
			'@type': 'Person',
			'@id': 'https://danielmoretti.com/#daniel-moretti',
			name: 'Daniel Moretti',
			url: 'https://danielmoretti.com/'
		},
		keywords: ['Next.js', 'TypeScript', 'tRPC', 'Prismic', 'Web development']
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="https://danielmoretti.com/showcase/darspa" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://danielmoretti.com/showcase/darspa" />
	<meta property="og:image" content="https://danielmoretti.com/images/darspa/darspa-social.jpg" />
	<meta property="og:image:alt" content="DarSpa healthcare center website" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://danielmoretti.com/images/darspa/darspa-social.jpg" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<CaseStudy
	techs={['Next.js', 'TypeScript', 'TailwindCSS', 'Vercel', 'TRPC', 'React', 'Zod']}
	title="DarSpa"
	appType={['Web', 'site']}
	mockupSrc="/images/darspa/mockup-darspa.png"
	mockupAlt="mockup of darspa website"
	techClass="bg-teal-600"
	hasLiveVersion
	liveUrl="https://darspa.cl/"
	description="This project was a complete implementation of the website for a Healthcare center from the ground up, including design in Figma, development of the components, development of the Server, handling of the custom logic, and handling of the CI pipeline."
	extraPictures={[
		{
			header: 'Beautifully crafted components',
			src: '/images/darspa/components.png',
			alt: 'beautiful components'
		},
		{
			header: 'Integration with the Meta API for using Instagram posts as a data source',
			src: '/images/darspa/instagram-api.png',
			alt: 'instagram api integration'
		},
		{
			header: 'Intelligent design that appeals to the customers to take action',
			src: '/images/darspa/intelligent.png',
			alt: 'intelligent design'
		},
		{
			header: 'Nodemailer custom logic for handling forms',
			src: '/images/darspa/nodemailer.png',
			alt: 'nodemailer integration'
		},
		{
			header: 'Integration with Prismic as a data source',
			src: '/images/darspa/prismic.png',
			alt: 'Prismic integration'
		}
	]}
/>
