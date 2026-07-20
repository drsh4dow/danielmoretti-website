import { error } from '@sveltejs/kit';
import { getAllPostsMeta, getPost } from '$lib/server/blog';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => getAllPostsMeta().map(({ uid }) => ({ uid }));

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.uid);

	if (!post) error(404, 'Post not found');

	return { post };
};
