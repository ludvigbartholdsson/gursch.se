import { loginSession, offlineSession, user } from '$lib/models/DatabaseModels';
import { eq, or } from 'drizzle-orm';
import { db } from './Database';
import * as bcrypt from 'bcrypt';
import type { LoginResponse, User } from '$lib/models/AuthenticationModels';

const saltRounds = 10;

export class AuthenticationService {
	async test(): Promise<void> {
		const sessions = await db.select().from(offlineSession);

		sessions.forEach(async (session) => {
			const players = JSON.parse(session.players);

			for (let i = 0; i < players.length; i++) {
				const sessions = await db
					.select()
					.from(user)
					.where(eq(user.emailAddress, players[i].emailAddress));

				Object.assign(players[i], {
					userName: sessions[0].userName
				});

				delete players[i].emailAddress;
			}

			await db
				.update(offlineSession)
				.set({ players: JSON.stringify(players) })
				.where(eq(offlineSession.sessionId, session.sessionId));
		});
	}

	async verifyCorrelationId(correlationId: string): Promise<string | null> {
		const ownerOfCorrelationId = (
			await db.select().from(loginSession).where(eq(loginSession.correlationId, correlationId))
		)?.[0];

		if (
			!ownerOfCorrelationId ||
			ownerOfCorrelationId.created < new Date(Date.now() - 1000 * 60 * 60 * 24 * 31)
		) {
			return null;
		}

		return ownerOfCorrelationId.userName;
	}

	async getAccount(userName: string): Promise<User> {
		const account = (await db.select().from(user).where(eq(user.userName, userName)))?.[0];

		return {
			firstName: account?.firstName,
			lastName: account?.lastName,
			userName: account?.userName,
			showInLeaderboard: account.showInLeaderboard,
			emailAddress: account.emailAddress,
			latestLogin: account.latestLogin,
			latestChange: account.latestChange,
			created: account.created
		};
	}

	async accountExists(emailAddress: string): Promise<boolean> {
		const account = (await db.select().from(user).where(eq(user.emailAddress, emailAddress)))?.[0];

		return !!account;
	}

	async userNameExists(userName: string): Promise<boolean> {
		const account = (await db.select().from(user).where(eq(user.userName, userName)))?.[0];

		return !!account;
	}

	async createAccount(
		userName: string,
		emailAddress: string,
		password: string,
		firstName: string,
		lastName: string
	) {
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		await db.insert(user).values({
			userName: userName,
			emailAddress: emailAddress,
			password: hashedPassword,
			firstName,
			lastName,
			showInLeaderboard: true,
			latestLogin: new Date(),
			latestChange: new Date(),
			created: new Date()
		});
	}

	async login(password: string, email: string = '', userName: string = ''): Promise<LoginResponse> {
		const account = (
			await db
				.select()
				.from(user)
				.where(or(eq(user.userName, userName), eq(user.emailAddress, email)))
		)?.[0];

		if (!account) {
			return {
				error: 'Inget konto hittades.'
			};
		}

		const isPasswordCorrect = await bcrypt.compare(password, account.password);

		if (!isPasswordCorrect) {
			return {
				error: 'Felaktigt lösenord.'
			};
		}

		await db.update(user).set({ latestLogin: new Date() }).where(eq(user.userName, userName));

		const correlationId = crypto.randomUUID();

		await db.insert(loginSession).values({
			userName: account.userName,
			correlationId,
			created: new Date()
		});

		return {
			correlationId
		};
	}

	async signOut(correlationId: string) {
		await db.delete(loginSession).where(eq(loginSession.correlationId, correlationId));
	}

	async changePassword(userName: string, newPassword: string) {
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		await db
			.update(user)
			.set({ latestLogin: new Date(), password: hashedPassword })
			.where(eq(user.userName, userName));
	}
}
