import type { PageServerLoad } from './$types';
import { OfflineSessionService } from '$lib/services/OfflineSessionService';

const offlineSessionService = new OfflineSessionService();

export const load = (async ({ locals }) => {
	return {
		initiatedSessions: (
			await offlineSessionService.listUserInitiatedSessions(locals.user.userName)
		).sort((a, b) => Number(new Date(b.created)) - Number(new Date(a.created))),

		participatedSessions: (
			await offlineSessionService.listUserParticipatedSessions(locals.user.userName)
		).sort((a, b) => Number(new Date(b.created)) - Number(new Date(a.created)))
	};
}) satisfies PageServerLoad;
