import { OnlineSessionService } from '$lib/services/OnlineSessionService';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ObjectOption } from 'svelte-multiselect';

const onlineSessionService = new OnlineSessionService();

export const load = (async ({ locals }) => {
	return {
		playableUsers: (await onlineSessionService.listUsers()).filter(
			(e) => e.value !== locals.user.userName
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	createOnlineSession: async ({ request, locals }) => {
		const data = await request.formData();
		const cardsString = data.get('cards')?.toString().trim();
		const playersString = data.get('users')?.toString().trim();
		const multiplierString = data.get('multiplier')?.toString().trim();
		const allowThrowsString = data.get('allowThrows')?.toString().trim();

		if (!cardsString || !playersString || !multiplierString || !allowThrowsString) {
			return {
				failure: {
					status: 400,
					message: 'Alla fält måste anges.'
				}
			};
		}

		const allowThrows = allowThrowsString === 'true';
		const cards = Number(cardsString);
		const multiplier = Number(multiplierString);
		const players: ObjectOption[] = JSON.parse(playersString);

		const validPlayers = (await onlineSessionService.listUsers())
			.map((e: ObjectOption) => e.value)
			.filter((e) => e !== locals.user.userName);

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
		finalPlayers.push(locals.user.userName);

		const sessionId = await onlineSessionService.createOnlineSession(
			cards,
			finalPlayers as string[],
			multiplier,
			allowThrows,
			locals.user.userName
		);

		redirect(303, `/dashboard/online-session/${sessionId}`);
	}
} satisfies Actions;
