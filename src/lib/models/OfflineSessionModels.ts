import type { DeckCard } from './DeckCard';

export interface OfflineSession {
	sessionId: string;
	initiator: string;
	cards: number;
	multiplier: number;
	created: Date;
	players: Player[];
}

export interface OfflineSessionOutcome {
	sessionId: string;
	winner: string;
	amount: number;
	loser: string;
	created: Date;
	game: number;
	playerCards: PlayerCard[];
}

export interface Player {
	emailAddress: string;
	firstName: string;
	lastName: string;
}

export interface PlayerCard {
	emailAddress: string;
	cards: DeckCard[];
	worth?: number;
	forceWin?: boolean; // if worth is equal among winners, this player wins
	forceLose?: boolean; // if worth is equal among losers, this player loses
}
