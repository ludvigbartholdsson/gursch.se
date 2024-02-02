import { GITHUB_TOKEN } from '$env/static/private';
import type { Discussion, MiniDiscussion } from '$lib/models/Discussion';

const listDiscussionsQuery = `{
  repository(name: "gursch.se", owner: "ludvigbartholdsson") {
    discussions(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        title
        number
      }
    }
  }
}`;

const getDiscussionQuery = (discussionId: string) => `{
  repository(name: "gursch.se", owner: "ludvigbartholdsson") {
    discussion(number: ${discussionId}) {
      bodyHTML
      title
    }
  }
}`;

export const listDiscussions = async (fetch: any): Promise<MiniDiscussion[]> => {
	return await cmsFetcher(listDiscussionsQuery, fetch);
};

export const getDiscussion = async (fetch: any, discussionId: string): Promise<Discussion> => {
	return (await cmsFetcher(getDiscussionQuery(discussionId), fetch))?.repository?.discussion;
};

export const cmsFetcher = async (query: string, fetch: any) => {
	try {
		const res = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `bearer ${GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query })
		});
		const { data } = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
