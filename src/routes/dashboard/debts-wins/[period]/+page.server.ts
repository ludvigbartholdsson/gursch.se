import { OfflineSessionService } from '$lib/services/OfflineSessionService';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const offlineSessionService = new OfflineSessionService();

export const load = (async ({ locals, params }) => {
	if (!['week', 'month', 'all-time'].includes(params.period)) {
		error(401);
	}

	return {
		summaryHistory: await offlineSessionService.getSummaryHistory(
			params.period,
			locals.user.userName
		)
	};
}) satisfies PageServerLoad;
