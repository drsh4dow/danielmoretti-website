import type { RequestHandler } from './$types';
import { getAllPostsMeta } from '$lib/server/blog';

export const prerender = true;

const xmlEntities: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'"': '&quot;',
	"'": '&apos;'
};

const escapeXml = (value: string) =>
	value.replace(/[<>&"']/g, (character) => xmlEntities[character]);

export const GET: RequestHandler = () => {
	const posts = getAllPostsMeta();
	const items = posts
		.map((post) => {
			const url = `https://danielmoretti.com/blog/${encodeURIComponent(post.uid)}`;
			return `\t\t<item>
\t\t\t<title>${escapeXml(post.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<description>${escapeXml(post.description)}</description>
\t\t\t<dc:creator>Daniel Moretti</dc:creator>
\t\t\t<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
\t\t</item>`;
		})
		.join('\n');
	const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
\t<channel>
\t\t<title>Daniel Moretti's Software Engineering Blog</title>
\t\t<link>https://danielmoretti.com/blog</link>
\t\t<description>Writing about software engineering, Rust, TypeScript, AI agents, Linux, and developer tooling.</description>
\t\t<language>en</language>
\t\t<lastBuildDate>${new Date(`${posts[0].updated}T00:00:00Z`).toUTCString()}</lastBuildDate>
\t\t<atom:link href="https://danielmoretti.com/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
\t</channel>
</rss>
`;

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
