export interface LoginResponse {
	correlationId?: string;
	error?: string;
}

export interface User {
	firstName: string | null;
	lastName: string | null;
	emailAddress: string;
	latestLogin: string;
	latestChange: string;
	created: string;
}
