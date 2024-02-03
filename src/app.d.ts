// See https://kit.svelte.dev/docs/types#app

import type { UserSession } from '$lib/models/AuthenticationModels';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: UserSessions;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
