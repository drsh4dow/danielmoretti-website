import { getAllPostsMeta } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	posts: getAllPostsMeta()
});
