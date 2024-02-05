import { OfflineSessionService } from '$lib/services/OfflineSessionService';
import type { PageServerLoad } from '../$types';

const offlineSessionService = new OfflineSessionService();

export const load = (async ({ locals, params }) => {
	await offlineSessionService.getProfitHistory(params.period, locals.user.emailAddress);
	return {};
}) satisfies PageServerLoad;
