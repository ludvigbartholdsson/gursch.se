import { offlineSession, offlineSessionOutcome, user } from '$lib/models/DatabaseModels';
import type {
	OfflineSession,
	OfflineSessionOutcome,
	Player,
	PlayerCard
} from '$lib/models/OfflineSessionModels';
import { eq, like, ne } from 'drizzle-orm';
import { db } from './Database';
import type { ObjectOption } from 'svelte-multiselect';
import { CardCalculator } from './CardCalculator';

const cardCalculator = new CardCalculator();

export class OfflineSessionService {
	async getProfitHistory(
		period: 'week' | 'month' | 'all-time',
		emailAddress: string
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
					eq(offlineSessionOutcome.winner, emailAddress) ||
						eq(offlineSessionOutcome.loser, emailAddress)
				)
		).map((e) => {
			return {
				...e,
				playerCards: e.playerCards
			};
		});

		console.log(outcomes);

		return {
			revenue: 0,
			won: 0,
			lost: 0
		};
	}

	async listUsers(): Promise<ObjectOption[]> {
		return (await db.select().from(user)).map((e) => {
			return {
				label: `${e.firstName} ${e.lastName}`,
				value: e.emailAddress
			};
		});
	}

	async listUserInitiatedSessions(emailAddress: string): Promise<OfflineSession[]> {
		const data =
			(await db.select().from(offlineSession).where(eq(offlineSession.initiator, emailAddress))) ??
			[];

		return data.map((e) => {
			return {
				...e,
				players: JSON.parse(e.players)
			};
		});
	}

	async listUserParticipatedSessions(emailAddress: string): Promise<OfflineSession[]> {
		const data =
			(await db
				.select()
				.from(offlineSession)
				.where(
					like(offlineSession.players, `%${emailAddress}%`) &&
						ne(offlineSession.initiator, emailAddress)
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
		emailAddress: string
	) {
		const playersDb: Player[] = await Promise.all(
			players.map(async (e) => {
				const playerUser = (await db.select().from(user).where(eq(user.emailAddress, e)))?.[0];

				return {
					emailAddress: e,
					firstName: playerUser.firstName!,
					lastName: playerUser.lastName!
				};
			})
		);

		const sessionId = crypto.randomUUID();

		await db.insert(offlineSession).values({
			initiator: emailAddress,
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
		if (winners[0].emailAddress === losers[0].emailAddress) {
			return;
		}

		await db.insert(offlineSessionOutcome).values({
			playerCards: JSON.stringify(playerCards),
			winner: winners[0].emailAddress,
			loser: losers[0].emailAddress,
			game: outcomes.length + 1,
			amount: amount.toString(),
			sessionId,
			created: new Date()
		});

		return;
	}
}
