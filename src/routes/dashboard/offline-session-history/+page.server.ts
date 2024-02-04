import type { PageServerLoad } from './$types';
import { OfflineSessionService } from '$lib/services/OfflineSessionService';

const offlineSessionService = new OfflineSessionService();

export const load = (async ({ locals }) => {
	return {
		initiatedSessions: await offlineSessionService.listUserInitiatedSessions(
			locals.user.emailAddress
		),
		participatedSessions: await offlineSessionService.listUserParticipatedSessions(
			locals.user.emailAddress
		)
	};
}) satisfies PageServerLoad;
