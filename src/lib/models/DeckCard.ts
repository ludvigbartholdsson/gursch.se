export enum DeckCard {
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	//Seven = 7, Chameleon
	Eight = 8,
	Nine = 9,
	Ten = 10,
	Jack = 11,
	Queen = 12,
	King = 13,
	Ace = 14,
	Chameleon // Depends
}

export const DeckFriendlyNames = {
	[DeckCard.Two]: '2',
	[DeckCard.Three]: '3',
	[DeckCard.Four]: '4',
	[DeckCard.Five]: '5',
	[DeckCard.Six]: '6',
	[DeckCard.Eight]: '8',
	[DeckCard.Nine]: '9',
	[DeckCard.Ten]: '10',
	[DeckCard.Jack]: 'Knekt',
	[DeckCard.Queen]: 'Dam',
	[DeckCard.King]: 'Kung',
	[DeckCard.Ace]: 'Ess',
	[DeckCard.Chameleon]: 'Kameleont (joker, 7a, ...)'
};
