import type { RequestHandler } from './$types';
import { getAllPostsMeta } from '$lib/server/blog';

export const prerender = true;

const siteUrl = 'https://danielmoretti.com';

export const GET: RequestHandler = () => {
	const staticUrls = ['/', '/blog', '/showcase/darspa', '/showcase/e-ficha'].map(
		(path) => `\t<url>\n\t\t<loc>${siteUrl}${path}</loc>\n\t</url>`
	);
	const postUrls = getAllPostsMeta().map(
		(post) =>
			`\t<url>\n\t\t<loc>${siteUrl}/blog/${encodeURIComponent(post.uid)}</loc>\n\t\t<lastmod>${post.updated}</lastmod>\n\t</url>`
	);
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>
`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
