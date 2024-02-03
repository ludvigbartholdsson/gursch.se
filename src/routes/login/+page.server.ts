import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthenticationService } from '$lib/services/AuthenticationService';

const databaseService = new AuthenticationService();

export const load = (async ({ locals }) => {
	if (locals?.user) {
		redirect(307, '/dashboard');
	}

	return {};
}) satisfies PageServerLoad;

export const actions = {
	accountExists: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim();

		// Check email address
		if (!email) {
			return {
				failure: {
					status: 400,
					message: 'Både emailadress och lösenord måste anges.'
				}
			};
		}

		if (!email.endsWith('@edu.samskolan.se')) {
			return {
				failure: {
					status: 400,
					message: 'Endast @edu.samskolan.se är tillåtet.'
				}
			};
		}

		const accountExists = await databaseService.accountExists(email);

		return {
			emailAddress: email,
			accountExists: accountExists
		};
	},

	createAccount: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('emailAddress')?.toString().trim();
		const password = data.get('password')?.toString().trim();
		const firstName = data.get('firstName')?.toString().trim();
		const lastName = data.get('lastName')?.toString().trim();

		if (!password || !email || !firstName || !lastName) {
			return {
				failure: {
					status: 400,
					message: 'Alla fält måste anges.'
				}
			};
		}

		if (!email.endsWith('@edu.samskolan.se')) {
			return {
				failure: {
					status: 400,
					message: 'Endast @edu.samskolan.se är tillåtet.'
				}
			};
		}

		await databaseService.createAccount(email, password, firstName, lastName);

		const loginInformation = await databaseService.login(password, email);

		if (loginInformation?.error) {
			return {
				failure: {
					status: 'N/A',
					message:
						'Ett fel uppstod när vi försökte logga in dig. Kontrollera att lösenordet är korrekt.'
				}
			};
		}

		cookies.set('correlationId', loginInformation.correlationId!, {
			maxAge: 30 * 24 * 60 * 60,
			path: '/',
			sameSite: 'lax',
			secure: false
		});

		redirect(303, '/dashboard');
	},

	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString().trim();

		// Check email address
		if (!email || !password) {
			return {
				failure: {
					status: 400,
					message: 'Både emailadress och lösenord måste anges.'
				}
			};
		}

		if (!email.endsWith('@edu.samskolan.se')) {
			return {
				failure: {
					status: 400,
					message: 'Endast @edu.samskolan.se är tillåtet.'
				}
			};
		}

		const loginInformation = await databaseService.login(password, email);

		if (loginInformation?.error) {
			return {
				failure: {
					status: 'N/A',
					message:
						'Ett fel uppstod när vi försökte logga in dig. Kontrollera att lösenordet är korrekt.'
				}
			};
		}

		cookies.set('correlationId', loginInformation.correlationId!, {
			maxAge: 30 * 24 * 60 * 60,
			path: '/',
			sameSite: 'lax',
			secure: false
		});

		redirect(303, '/dashboard');
	}
} satisfies Actions;
