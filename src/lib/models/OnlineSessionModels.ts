import type { DeckCard } from './DeckCard';

export interface OnlineSession {
	sessionId: string;
	initiator: string;
	cards: number;
	multiplier: number;
	created: Date;
	players: Player[];
}

export interface Player {
	userName: string;
	firstName: string;
	lastName: string;
}

export interface PlayerCard {
	userName: string;
	cards: DeckCard[];
	worth?: number;
	forceWin?: boolean; // if worth is equal among winners, this player wins
	forceLose?: boolean; // if worth is equal among losers, this player loses
}

export interface OnlineSessionRoundOutcome {
	sessionId: string;
	roundNumber: number;
	playerCards: PlayerCard[];
	created: Date;
}

export interface OnlineSessionRound {
	sessionId: string;
	roundNumber: number;
	created: Date;
	flopWinner: string;
	winner?: string;
	loser?: string;
	amount?: number;
}
