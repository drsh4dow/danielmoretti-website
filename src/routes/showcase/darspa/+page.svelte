<script lang="ts">
	import CaseStudy from '$lib/caseStudy/CaseStudy.svelte';
</script>

<svelte:head>
	<title>DarSpa Case Study</title>
	<meta
		name="description"
		content="DarSpa case study — healthcare center website built from the ground up with Next.js, TypeScript, tRPC, and Prismic by Daniel Moretti."
	/>
	<link rel="canonical" href="https://danielmoretti.com/showcase/darspa" />
	<meta property="og:title" content="DarSpa Case Study" />
	<meta
		property="og:description"
		content="DarSpa case study — healthcare center website built from the ground up with Next.js, TypeScript, tRPC, and Prismic by Daniel Moretti."
	/>
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
