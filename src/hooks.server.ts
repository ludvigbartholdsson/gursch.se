import { AuthenticationService } from '$lib/services/AuthenticationService';
import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

const authenticationService = new AuthenticationService();

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	if (cookies.correlationId?.length > 0 && cookies.correlationId) {
		const userEmail = await authenticationService.verifyCorrelationId(cookies.correlationId);

		if (userEmail) {
			const account = await authenticationService.getAccount(userEmail);

			event.locals.user = {
				firstName: account?.firstName,
				lastName: account?.lastName,
				emailAddress: account.emailAddress,
				latestLogin: account.latestLogin,
				latestChange: account.latestChange,
				correlationId: cookies.correlationId,
				created: account.created
			};
		}
	}

	if (event.url.pathname.includes('/dashboard') && !event.locals?.user) {
		return new Response(null, {
			status: 303,
			headers: { location: '/login' }
		});
	}

	const response = await resolve(event);
	return response;
};
