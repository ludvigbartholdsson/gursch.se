import { loginSessions, users } from '$lib/models/DatabaseModels';
import { eq } from 'drizzle-orm';
import { db } from './Database';
import * as bcrypt from 'bcrypt';
import type { LoginResponse, User } from '$lib/models/AuthenticationModels';

const saltRounds = 10;

export class AuthenticationService {
	async verifyCorrelationId(correlationId: string): Promise<string | null> {
		const ownerOfCorrelationId = (
			await db.select().from(loginSessions).where(eq(loginSessions.correlationId, correlationId))
		)?.[0];

		if (
			!ownerOfCorrelationId ||
			ownerOfCorrelationId.created < new Date(Date.now() - 1000 * 60 * 60 * 24 * 31)
		) {
			return null;
		}

		return ownerOfCorrelationId.emailAddress;
	}

	async getAccount(emailAddress: string): Promise<User> {
		const account = (
			await db.select().from(users).where(eq(users.emailAddress, emailAddress))
		)?.[0];

		return {
			firstName: account?.firstName,
			lastName: account?.lastName,
			emailAddress: account.emailAddress,
			latestLogin: account.latestLogin.toISOString(),
			latestChange: account.latestChange.toISOString(),
			created: account.created.toISOString()
		};
	}

	async accountExists(emailAddress: string): Promise<boolean> {
		const account = (
			await db.select().from(users).where(eq(users.emailAddress, emailAddress))
		)?.[0];

		return !!account;
	}

	async createAccount(emailAddress: string, password: string, firstName: string, lastName: string) {
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		await db.insert(users).values({
			emailAddress: emailAddress,
			password: hashedPassword,
			firstName,
			lastName,
			latestLogin: new Date(),
			latestChange: new Date(),
			created: new Date()
		});
	}

	async login(password: string, emailAddress: string): Promise<LoginResponse> {
		const account = (
			await db.select().from(users).where(eq(users.emailAddress, emailAddress))
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

		await db
			.update(users)
			.set({ latestLogin: new Date() })
			.where(eq(users.emailAddress, emailAddress));

		const correlationId = crypto.randomUUID();

		await db.insert(loginSessions).values({
			emailAddress,
			correlationId,
			created: new Date()
		});

		return {
			correlationId
		};
	}

	async signOut(correlationId: string) {
		await db.delete(loginSessions).where(eq(loginSessions.correlationId, correlationId));
	}

	async changePassword(emailAddress: string, newPassword: string) {
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		await db
			.update(users)
			.set({ latestLogin: new Date(), password: hashedPassword })
			.where(eq(users.emailAddress, emailAddress));
	}
}
