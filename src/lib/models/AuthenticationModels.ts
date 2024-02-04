export interface LoginResponse {
	correlationId?: string;
	error?: string;
}

export interface User {
	firstName: string | null;
	lastName: string | null;
	emailAddress: string;
	showInLeaderboard: boolean;
	latestLogin: Date;
	latestChange: Date;
	created: Date;
}

export interface UserSession extends User {
	correlationId: string;
}
