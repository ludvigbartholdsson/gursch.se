import type { PageServerLoad } from './$types';
import { AuthenticationService } from '$lib/services/AuthenticationService';
import { redirect } from '@sveltejs/kit';

const authService = new AuthenticationService();

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/');
	}

	await authService.signOut(locals.user.correlationId);

	return {};
}) satisfies PageServerLoad;
