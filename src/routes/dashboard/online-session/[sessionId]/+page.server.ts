import { OnlineSessionService } from '$lib/services/OnlineSessionService';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DeckCard } from '$lib/models/DeckCard';
import { CardCalculator } from '$lib/services/CardCalculator';
import type { PlayerCard } from '$lib/models/OfflineSessionModels';

const onlineSessionService = new OnlineSessionService();
const cardCalculator = new CardCalculator();

export const load = (async ({ params }) => {
	const sessionId = params.sessionId;

	const session = await onlineSessionService.getOnlineSession(sessionId);
	if (!session) {
		error(404);
	}

	//const isExpired = onlineSessionService.isOnlineSessionExpired(session, sessionOutcomes);

	return {
		//sessionIsExpired: isExpired,
		session
	};
}) satisfies PageServerLoad;
