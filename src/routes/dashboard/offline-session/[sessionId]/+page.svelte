<script lang="ts">
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import { MultiSelect } from 'svelte-multiselect';
	import type { PageData } from './$types';
	import { DeckCard, DeckFriendlyNames } from '$lib/models/DeckCard';
	import { CardCalculator } from '$lib/services/CardCalculator';
	import Popup from '$lib/components/popup/index.svelte';
	import type { PlayerCard } from '$lib/models/OfflineSessionModels';
	import RoundInformation from '$lib/components/offline-session/roundInformation.svelte';

	export let data: PageData;
	let form: HTMLFormElement;
	let selectedCards: Record<string, DeckCard[]> = {};

	let playerCards: PlayerCard[] = [];
	$: playerCards = Object.entries(selectedCards).map(([userName, cards]) => ({
		userName,
		cards,
		worth: undefined,
		forceWin: undefined,
		forceLose: undefined
	}));
	let playerCardsStringified: string;
	$: playerCardsStringified = JSON.stringify(playerCards);

	let decideWinnerList: PlayerCard[] = [];
	let decideWinner = false;

	let decideLoserList: PlayerCard[] = [];
	let decideLoser = false;

	const cardCalculator = new CardCalculator();

	function forceWinnerWorth(userName: string) {
		const i = playerCards.findIndex((e) => e.userName === userName);
		playerCards[i].forceWin = true;

		if (playerCards.length === 2) {
			forceLoserWorth(playerCards.find((e) => e.userName !== userName)!.userName);
		}

		checkWinnersAndLosers();
	}

	function forceLoserWorth(userName: string) {
		const i = playerCards.findIndex((e) => e.userName === userName);
		playerCards[i].forceLose = true;

		checkWinnersAndLosers();
	}

	async function checkWinnersAndLosers() {
		decideWinner = false;
		decideWinnerList = [];
		decideLoser = false;
		decideLoserList = [];

		const winners = cardCalculator.getWinners(playerCards);
		const losers = cardCalculator.getLosers(playerCards);

		if (winners.length > 1) {
			decideWinnerList = winners;
			decideWinner = true;
			return;
		}

		if (losers.length > 1) {
			decideLoserList = losers;
			decideLoser = true;
			return;
		}

		playerCardsStringified = JSON.stringify(playerCards);

		await tick();

		form.submit();
	}

	const maxResults = data.sessionOutcomes.reduce<{
		totals: Record<string, number>;
		maxWinner: string;
		maxWinnerAmount: number;
		maxLoser: string;
		maxLoserAmount: number;
	}>(
		(acc, outcome) => {
			const { winner, loser, amount } = outcome;

			acc.totals[winner] = (acc.totals[winner] || 0) + amount;
			acc.totals[loser] = (acc.totals[loser] || 0) - amount;

			acc.maxWinner = winner;
			acc.maxWinnerAmount = acc.totals[winner];

			acc.maxLoser = loser;
			acc.maxLoserAmount = acc.totals[loser];

			if (acc.maxWinnerAmount === 0) {
				acc.maxWinner = '';
				acc.maxWinnerAmount = 0;
			}

			if (acc.maxLoserAmount === 0) {
				acc.maxLoser = '';
				acc.maxLoserAmount = 0;
			}
			return acc;
		},
		{ totals: {}, maxWinner: '', maxWinnerAmount: 0, maxLoser: '', maxLoserAmount: 0 }
	);

	const { maxWinner, maxLoser, maxWinnerAmount, maxLoserAmount } = maxResults;
</script>

{#if decideWinner}
	<Popup
		header={'Vem vann?'}
		description={'Endast en spelare kan vinna matchen. Man kan avgöra detta genom t.ex mini-gursch eller den som vinner flopp nästa runda.'}
	>
		<div class="grid mt-4 grid-cols-2 gap-3">
			{#each decideWinnerList as winner}
				<button
					on:click={() => forceWinnerWorth(winner.userName)}
					class="col-span-1 hover:border-blue-600 rounded-lg text-black border-2 bg-white text-center shadow"
				>
					<div class="flex flex-1 justify-center items-center flex-col py-1 px-2">
						<p>
							{data.session.players.find((e) => e.userName === winner.userName)?.firstName}
							{data.session.players
								.find((e) => e.userName === winner.userName)
								?.lastName.slice(0, 1)}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</Popup>
{/if}

{#if decideLoser}
	<Popup
		header={'Vem förlora?'}
		description={'Endast en spelare kan förlora matchen. Man kan avgöra detta genom t.ex mini-gursch eller den som förlorar flopp nästa runda.'}
	>
		<div class="grid mt-4 grid-cols-2 gap-3">
			{#each decideLoserList as loser}
				<button
					on:click={() => forceLoserWorth(loser.userName)}
					class="col-span-1 hover:border-blue-600 rounded-lg text-black border-2 bg-white text-center shadow"
				>
					<div class="flex flex-1 justify-center items-center flex-col py-1 px-2">
						<p>
							{data.session.players.find((e) => e.userName === loser.userName)?.firstName}
							{data.session.players
								.find((e) => e.userName === loser.userName)
								?.lastName.slice(0, 1)}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</Popup>
{/if}

<div class="container mx-auto py-12">
	{#if !data.sessionIsExpired}
		<h1>Runda: {(data.sessionOutcomes?.length ?? 0) + 1}</h1>
	{:else}
		<h1>Avslutad session</h1>
	{/if}

	<div class="flex flex-col gap-6">
		{#if !data.sessionIsExpired}
			{#if data.session.initiator === $page.data.user.userName}
				<form
					bind:this={form}
					on:submit|preventDefault={checkWinnersAndLosers}
					class="flex flex-col gap-6"
					method="POST"
					action="?/createOfflineSessionOutcome"
				>
					<h2 class="!my-0">Vad gick alla ut på?</h2>
					{#each data.session.players as player}
						<div class="flex flex-row flex-wrap gap-2 items-center">
							<p class="ring-1 ring-gray-300 text-lg bg-gray-100 h-10 rounded-md px-3 py-1">
								{player.firstName}
								{player.lastName.slice(0, 1)}
							</p>
							<div>
								<MultiSelect
									id="color-select"
									options={Object.values(DeckCard)
										.filter((e) => typeof e !== 'number')
										.map((e) => DeckFriendlyNames[DeckCard[e]])}
									bind:selected={selectedCards[player.userName]}
									placeholder="Välj kort"
									noMatchingOptionsMsg={'Kort hittades ej.'}
									allowUserOptions={false}
									duplicates={true}
									createOptionMsg={null}
									maxSelect={data.session.cards}
									required
									let:idx
									let:option
								>
									<p>{option}</p>
								</MultiSelect>
							</div>
						</div>
					{/each}
					<input
						type="hidden"
						name="cards"
						id="cards"
						bind:value={playerCardsStringified}
						class="invisible"
						required
					/>
					<div>
						<button
							disabled={Object.keys(selectedCards).length !== data.session.players.length ||
								!cardCalculator.checkEqualCardsLength(selectedCards)}
							type="submit"
							class="flex w-fit justify-center rounded-md disabled:bg-blue-400 bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
							>Registrera runda och fortsätt</button
						>
					</div>
				</form>
			{:else}
				<div class="rounded-md bg-yellow-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg
								class="h-5 w-5 text-yellow-400"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-yellow-800 !my-0">
								Du har inte skapat denna session.
							</h3>
							<div class="mt-2 text-sm text-yellow-700">
								<p>
									Endast den personen som startade denna session kan lägga till rundor, men du kan
									hålla koll på vad som händer här om du vill. Glöm inte refresha sidan för att se
									eventuella ny rundor.
								</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<div class="rounded-md bg-yellow-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-yellow-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-yellow-800 !my-0">Denna session har löpt ut.</h3>
						<div class="mt-2 text-sm text-yellow-700">
							<p>
								Det har gått mer än 10 minuter sedan denna session skapades eller användes senast,
								så skapa en ny om du vill spela.
							</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<hr />

		<div class="flex flex-col gap-2">
			<h3 class="!my-0">Information</h3>
			<div class="flex flex-col gap-1">
				<div class="flex flex-row gap-2">
					<h4 class="my-0">Totalt spelat om</h4>
					<div class="flex items-center justify-between">
						<p class="ring-1 ring-gray-300 bg-gray-100 rounded-md px-3 py-1">
							{data.sessionOutcomes
								.map((e) => e.amount)
								.reduce((partialSum, a) => partialSum + a, 0)}
							kr
						</p>
					</div>
				</div>
				<div class="flex flex-row gap-2">
					<h4 class="my-0">Den som har vunnit mest är</h4>
					<div class="flex items-center justify-between">
						<p class="ring-1 ring-gray-300 bg-gray-100 rounded-md px-3 py-1">
							{#if maxWinner}
								{data.session.players.find((e) => e.userName === maxWinner)?.firstName}
								{data.session.players.find((e) => e.userName === maxWinner)?.lastName} ({maxWinnerAmount}
								kr)
							{:else}
								N/A
							{/if}
						</p>
					</div>
				</div>
				<div class="flex flex-row gap-2">
					<h4 class="my-0">Den som har förlorat mest är</h4>
					<div class="flex items-center justify-between">
						<p class="ring-1 ring-gray-300 bg-gray-100 rounded-md px-3 py-1">
							{#if maxLoser}
								{data.session.players.find((e) => e.userName === maxLoser)?.firstName}
								{data.session.players.find((e) => e.userName === maxLoser)?.lastName} ({maxLoserAmount}
								kr)
							{:else}
								N/A
							{/if}
						</p>
					</div>
				</div>
			</div>

			<div>
				<h4>Spelare</h4>
				<div class="flex flex-col gap-2">
					{#each data.session.players as player}
						<div class="flex items-center justify-between">
							<p class="ring-1 ring-gray-300 bg-gray-100 rounded-md px-3 py-1">
								{player.firstName}
								{player.lastName}
								{#if player.userName === $page.data.user.userName}
									(du)
								{/if}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<div>
				<h4>Multipel</h4>
				<div class="flex items-center justify-between">
					<p class="ring-1 ring-gray-300 bg-gray-100 rounded-md px-3 py-1">
						{data.session.multiplier}x
					</p>
				</div>
			</div>
			<div>
				<h4>Antal kort</h4>
				<div class="flex items-center justify-between">
					<p class="ring-1 ring-gray-300 bg-gray-100 rounded-md px-3 py-1">
						{data.session.cards} st
					</p>
				</div>
			</div>
		</div>

		<hr />

		<div class="flex flex-col gap-2">
			<h3 class="!my-0">Tidigare rundor</h3>
			<div>
				{#if !data.sessionOutcomes || data.sessionOutcomes.length === 0}
					<p>N/A</p>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{#each data.sessionOutcomes as outcome}
							<RoundInformation {outcome} session={data.session} />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	:global(.multiselect) {
		@apply !min-h-10 !py-1 !w-fit ring-1 ring-gray-300 !border-0 focus-within:ring-2 focus-within:ring-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600;
	}
</style>
