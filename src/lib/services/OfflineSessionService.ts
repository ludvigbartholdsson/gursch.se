import { offlineSession, offlineSessionOutcome, user } from '$lib/models/DatabaseModels';
import type {
	OfflineSession,
	OfflineSessionOutcome,
	Player,
	PlayerCard
} from '$lib/models/OfflineSessionModels';
import { and, eq, like, ne, or } from 'drizzle-orm';
import { db } from './Database';
import type { ObjectOption } from 'svelte-multiselect';
import { CardCalculator } from './CardCalculator';
import { isThisMonth, isThisWeek } from './Utils';

const cardCalculator = new CardCalculator();

export class OfflineSessionService {
	async getSummaryHistory(
		period: 'week' | 'month' | 'all-time',
		userName: string
	): Promise<{
		revenue: number;
		won: number;
		lost: number;
	}> {
		const outcomes = (
			await db
				.select()
				.from(offlineSessionOutcome)
				.where(
					or(eq(offlineSessionOutcome.winner, userName), eq(offlineSessionOutcome.loser, userName))
				)
		).map((e) => {
			return {
				...e,
				amount: Number(e.amount),
				playerCards: JSON.parse(e.playerCards)
			};
		});

		let outcomesAggregated = outcomes;

		if (period === 'week') {
			outcomesAggregated = outcomes.filter((e) => isThisWeek(e.created));
		} else if (period === 'month') {
			outcomesAggregated = outcomes.filter((e) => isThisMonth(e.created));
		}

		const wonTotal = outcomesAggregated
			.filter((e) => e.winner === userName)
			.reduce((acc, e) => acc + e.amount, 0);

		const lostTotal = outcomesAggregated
			.filter((e) => e.loser === userName)
			.reduce((acc, e) => acc + e.amount, 0);

		return {
			revenue: outcomesAggregated.reduce((acc, e) => acc + e.amount, 0),
			won: wonTotal,
			lost: lostTotal
		};
	}

	async listUsers(): Promise<ObjectOption[]> {
		return (await db.select().from(user)).map((e) => {
			return {
				label: `${e.firstName} ${e.lastName}`,
				value: e.userName
			};
		});
	}

	async listUserInitiatedSessions(userName: string): Promise<OfflineSession[]> {
		const data =
			(await db.select().from(offlineSession).where(eq(offlineSession.initiator, userName))) ?? [];

		return data.map((e) => {
			return {
				...e,
				players: JSON.parse(e.players)
			};
		});
	}

	async listUserParticipatedSessions(userName: string): Promise<OfflineSession[]> {
		const data =
			(await db
				.select()
				.from(offlineSession)
				.where(
					and(like(offlineSession.players, `%${userName}%`), ne(offlineSession.initiator, userName))
				)) ?? [];

		return data.map((e) => {
			return {
				...e,
				players: JSON.parse(e.players)
			};
		});
	}

	isOfflineSessionExpired(session: OfflineSession, outcomes: OfflineSessionOutcome[]): boolean {
		const lastOutcome = outcomes.sort(
			(a, b) => Number(new Date(b.created)) - Number(new Date(a.created))
		)[0];

		const now = new Date();

		if (!lastOutcome) {
			const sessionCreated = new Date(session.created);
			const diff = now.getTime() - sessionCreated.getTime();

			return diff > 60 * 10 * 1000;
		}

		const lastOutcomeDate = new Date(lastOutcome.created);
		const diff = now.getTime() - lastOutcomeDate.getTime();

		return diff > 60 * 10 * 1000;
	}

	async getOfflineSession(sessionId: string): Promise<OfflineSession | null> {
		const data = (
			await db.select().from(offlineSession).where(eq(offlineSession.sessionId, sessionId))
		)?.[0];

		if (data) {
			return {
				...data,
				players: JSON.parse(data.players)
			};
		}

		return null;
	}

	async getOfflineSessionOutcomes(sessionId: string): Promise<OfflineSessionOutcome[]> {
		const data = await db
			.select()
			.from(offlineSessionOutcome)
			.where(eq(offlineSessionOutcome.sessionId, sessionId));

		if (data) {
			const newData = data.map((e) => {
				return {
					...e,
					amount: Number(e.amount),
					playerCards: JSON.parse(e.playerCards)
				};
			});

			return newData;
		}

		return [];
	}

	async createOfflineSession(
		cards: number,
		players: string[],
		multiplier: number,
		userName: string
	) {
		const playersDb: Player[] = await Promise.all(
			players.map(async (e) => {
				const playerUser = (await db.select().from(user).where(eq(user.userName, e)))?.[0];

				return {
					userName: e,
					firstName: playerUser.firstName!,
					lastName: playerUser.lastName!
				};
			})
		);

		const sessionId = crypto.randomUUID();

		await db.insert(offlineSession).values({
			initiator: userName,
			cards: cards,
			players: JSON.stringify(playersDb),
			multiplier: multiplier,
			sessionId,
			created: new Date()
		});

		return sessionId;
	}

	async createOfflineSessionOutcome(sessionId: string, playerCards: PlayerCard[]) {
		// Get all current outcomes
		const outcomes = await this.getOfflineSessionOutcomes(sessionId);

		// Get multiplier
		const thisOfflineSession = (
			await db.select().from(offlineSession).where(eq(offlineSession.sessionId, sessionId))
		)?.[0];

		if (!thisOfflineSession) {
			return;
		}

		// Determine winner
		const winners = cardCalculator.getWinners(playerCards);

		// Determine loser
		const losers = cardCalculator.getLosers(playerCards);

		// Determine amount
		const amount = Math.round(losers[0].worth! * thisOfflineSession.multiplier);

		// Double-check winners/losers
		if (winners[0].userName === losers[0].userName) {
			return;
		}

		await db.insert(offlineSessionOutcome).values({
			playerCards: JSON.stringify(playerCards),
			winner: winners[0].userName,
			loser: losers[0].userName,
			game: outcomes.length + 1,
			amount: amount.toString(),
			sessionId,
			created: new Date()
		});

		return;
	}
}
