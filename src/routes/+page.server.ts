import type { PageServerLoad } from './$types';
import { getDiscussion } from '$lib/github-cms/fetcher';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await getDiscussion(fetch, '1');

	return res;
};
