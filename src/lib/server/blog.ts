import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { createHighlighter, type Highlighter } from 'shiki';
import { months } from '$lib/util/constants';

export interface BlogPostMeta {
	uid: string;
	title: string;
	description: string;
	date: string;
	displayDate: string;
	updated: string;
	banner?: string;
	bannerAlt?: string;
	bannerCredit?: string;
}

export interface BlogPost extends BlogPostMeta {
	html: string;
}

const rawPosts = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

let highlighter: Highlighter | undefined;

async function getMarked() {
	highlighter ??= await createHighlighter({
		themes: ['gruvbox-dark-medium'],
		langs: ['typescript', 'javascript', 'bash', 'shell']
	});

	return new Marked(
		markedHighlight({
			highlight(code, lang) {
				const language = ['ts', 'typescript', 'js', 'javascript', 'bash', 'shell', 'sh'].includes(
					lang
				)
					? lang
					: guessLanguage(code);
				return highlighter!.codeToHtml(code, {
					lang: language,
					theme: 'gruvbox-dark-medium'
				});
			}
		}),
		{
			renderer: {
				heading({ tokens, depth }) {
					const level = Math.min(depth + 1, 6);
					return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
				},
				// shiki already emits a <pre class="shiki"> block
				code({ text, lang, escaped }) {
					if (escaped && text.startsWith('<pre')) return text;
					return `<pre><code>${text}</code></pre>`;
				}
			}
		}
	);
}

function guessLanguage(code: string): string {
	if (/\b(const|let|function|=>|await|Promise)\b/.test(code)) return 'typescript';
	if (/^\s*(\$|#|cd |ls |sudo |mkdir |pacman |apt )/m.test(code)) return 'bash';
	return 'bash';
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
	if (!match) return { meta: {}, body: raw };

	const meta: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const idx = line.indexOf(':');
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		let value = line.slice(idx + 1).trim();
		if (value.startsWith('"') && value.endsWith('"')) {
			value = JSON.parse(value);
		} else if (value.startsWith("'") && value.endsWith("'")) {
			value = value.slice(1, -1);
		}
		meta[key] = value;
	}
	return { meta, body: raw.slice(match[0].length) };
}

function toDisplayDate(isoDate: string): string {
	const [year, month, day] = isoDate.split('-');
	return `${months[Number(month) - 1]} ${Number(day)}, ${year}`;
}

function toPostMeta(uid: string, meta: Record<string, string>): BlogPostMeta {
	return {
		uid,
		title: meta.title ?? uid,
		description: meta.description ?? '',
		date: meta.date ?? '',
		displayDate: meta.date ? toDisplayDate(meta.date) : '',
		updated: meta.updated ?? meta.date ?? '',
		banner: meta.banner,
		bannerAlt: meta.bannerAlt,
		bannerCredit: meta.bannerCredit
	};
}

export function getAllPostsMeta(): BlogPostMeta[] {
	const posts = Object.entries(rawPosts).map(([path, raw]) => {
		const uid = path.split('/').pop()!.replace(/\.md$/, '');
		const { meta } = parseFrontmatter(raw);
		return toPostMeta(uid, meta);
	});

	return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(uid: string): Promise<BlogPost | undefined> {
	const entry = Object.entries(rawPosts).find(([path]) => path.endsWith(`/${uid}.md`));
	if (!entry) return undefined;

	const { meta, body } = parseFrontmatter(entry[1]);
	const marked = await getMarked();
	const html = await marked.parse(body);

	return {
		...toPostMeta(uid, meta),
		html
	};
}
