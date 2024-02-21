import { DeckCard } from '$lib/models/DeckCard';
import { type PlayerCard } from '$lib/models/OfflineSessionModels';

export class CardCalculator {
	getLosers(players: PlayerCard[]): PlayerCard[] {
		let highestScore = this.calculateScore(players[0].cards);
		let losers: PlayerCard[] = [
			{
				...players[0],
				worth: highestScore
			}
		];

		for (let i = 1; i < players.length; i++) {
			const playerScore = this.calculateScore(players[i].cards);
			if (playerScore > highestScore) {
				losers = [
					{
						...players[i],
						worth: playerScore
					}
				];
				highestScore = playerScore;
			} else if (playerScore === highestScore) {
				losers.push({
					...players[i],
					worth: playerScore
				});
			}
		}

		// Clear out other that has forceWin
		const forceWin = losers.findIndex((e) => e.forceWin);

		if (forceWin > -1) {
			losers.splice(forceWin, 1);
		}

		// Clear out other that hasn't forceLose
		const forceLose = losers.findIndex((e) => e.forceLose);

		if (forceLose > -1) {
			losers = [losers[forceLose]];
		}

		return losers;
	}

	getWinners(players: PlayerCard[]): PlayerCard[] {
		let lowestScore = this.calculateScore(players[0].cards);
		let winners: PlayerCard[] = [
			{
				...players[0],
				worth: lowestScore
			}
		];

		for (let i = 1; i < players.length; i++) {
			const playerScore = this.calculateScore(players[i].cards);
			if (playerScore < lowestScore) {
				winners = [
					{
						...players[i],
						worth: playerScore
					}
				];
				lowestScore = playerScore;
			} else if (playerScore === lowestScore) {
				winners.push({
					...players[i],
					worth: playerScore
				});
			}
		}

		// Clear out other that has forceLose
		const forceLose = winners.findIndex((e) => e.forceLose);

		if (forceLose > -1) {
			winners.splice(forceLose, 1);
		}

		// Clear out other that hasn't forceWin
		const forceWin = winners.findIndex((e) => e.forceWin);

		if (forceWin > -1) {
			winners = [winners[forceWin]];
		}

		return winners;
	}

	private calculateScore(cards: DeckCard[]): number {
		if (cards.length === 1 && cards[0] === DeckCard.Chameleon) {
			return DeckCard.Two;
		}

		let lowestCardValue = Infinity;
		let chameleonCount = 0;
		let totalValue = 0;

		cards.forEach((card) => {
			if (card === DeckCard.Chameleon) {
				chameleonCount++;
			} else {
				totalValue += card;
				if (card < lowestCardValue) {
					lowestCardValue = card;
				}
			}
		});

		if (lowestCardValue !== Infinity) {
			totalValue += chameleonCount * lowestCardValue;
		} else {
			return chameleonCount * DeckCard.Two;
		}

		return totalValue;
	}

	public checkEqualCardsLength(selectedCards: Record<string, DeckCard[]>) {
		const lengths = Object.values(selectedCards).map((cards) => cards.length);
		const allEqual = lengths.every((val) => val === lengths[0] && val !== 0);
		return allEqual;
	}
}
