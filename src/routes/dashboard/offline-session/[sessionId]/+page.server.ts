import { OfflineSessionService } from '$lib/services/OfflineSessionService';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DeckCard } from '$lib/models/DeckCard';
import { CardCalculator } from '$lib/services/CardCalculator';
import type { PlayerCard } from '$lib/models/OfflineSessionModels';

const offlineSessionService = new OfflineSessionService();
const cardCalculator = new CardCalculator();

export const load = (async ({ params }) => {
	const sessionId = params.sessionId;

	const session = await offlineSessionService.getOfflineSession(sessionId);
	const sessionOutcomes = (await offlineSessionService.getOfflineSessionOutcomes(sessionId)).sort(
		(a, b) => Number(new Date(b.created)) - Number(new Date(a.created))
	);

	if (!session) {
		error(404);
	}

	const isExpired = offlineSessionService.isOfflineSessionExpired(session, sessionOutcomes);

	return {
		sessionIsExpired: isExpired,
		session,
		sessionOutcomes
	};
}) satisfies PageServerLoad;

export const actions = {
	createOfflineSessionOutcome: async ({ request, locals, params }) => {
		const data = await request.formData();
		const sessionId = params.sessionId!;
		const cardsString = data.get('cards')?.toString().trim();

		if (!cardsString) {
			return {
				failure: {
					status: 400,
					message: 'Alla kort måste anges.'
				}
			};
		}

		const cards: PlayerCard[] = JSON.parse(cardsString);

		const session = await offlineSessionService.getOfflineSession(sessionId);

		if (!session) {
			error(404);
		}

		const outcomes = await offlineSessionService.getOfflineSessionOutcomes(sessionId);
		const isExpired = offlineSessionService.isOfflineSessionExpired(session!, outcomes);

		if (isExpired) {
			error(401);
		}

		if (session.initiator !== locals.user.userName) {
			error(401);
		}

		const playerCardsSimple: Record<string, DeckCard[]> = cards.reduce((acc, playerCard) => {
			acc[playerCard.userName] = playerCard.cards;
			return acc;
		}, {});

		if (!cardCalculator.checkEqualCardsLength(playerCardsSimple)) {
			return {
				failure: {
					status: 400,
					message: 'Alla spelare måste gå ut på samma mängd kort, och det måste vara minst 1 kort.'
				}
			};
		}

		await offlineSessionService.createOfflineSessionOutcome(sessionId, cards);
	}
} satisfies Actions;
