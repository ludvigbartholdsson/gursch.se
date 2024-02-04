import { OfflineSessionService } from '$lib/services/OfflineSessionService';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ObjectOption } from 'svelte-multiselect';

const offlineSessionService = new OfflineSessionService();

export const load = (async ({ locals }) => {
	return {
		playableUsers: (await offlineSessionService.listUsers()).filter(
			(e) => e.value !== locals.user.emailAddress
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	createOfflineSession: async ({ request, locals }) => {
		const data = await request.formData();
		const cardsString = data.get('cards')?.toString().trim();
		const playersString = data.get('users')?.toString().trim();
		const multiplierString = data.get('multiplier')?.toString().trim();

		if (!cardsString || !playersString || !multiplierString) {
			return {
				failure: {
					status: 400,
					message: 'Alla fält måste anges.'
				}
			};
		}

		const cards = Number(cardsString);
		const multiplier = Number(multiplierString);
		const players: ObjectOption[] = JSON.parse(playersString);

		const validPlayers = (await offlineSessionService.listUsers())
			.map((e: ObjectOption) => e.value)
			.filter((e) => e !== locals.user.emailAddress);

		if (
			players.length <= 0 ||
			players.filter((e: ObjectOption) => !validPlayers.includes(e.value)).length > 0
		) {
			return {
				failure: {
					status: 400,
					message: 'Endast giltiga spelare får anges.'
				}
			};
		}

		if (![3, 5, 7].includes(cards)) {
			return {
				failure: {
					status: 400,
					message: 'Endast 3, 5 eller 7 kort får spelas med.'
				}
			};
		}

		if (multiplier <= 0) {
			return {
				failure: {
					status: 400,
					message: 'Multiplikatorn måste vara större än 0.'
				}
			};
		}

		const finalPlayers = players.map((e) => e.value);
		finalPlayers.push(locals.user.emailAddress);

		const sessionId = await offlineSessionService.createOfflineSession(
			cards,
			finalPlayers as string[],
			multiplier,
			locals.user.emailAddress
		);

		redirect(303, `/dashboard/offline-session/${sessionId}`);
	}
} satisfies Actions;
