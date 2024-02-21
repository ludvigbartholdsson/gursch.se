<script lang="ts">
	import { DeckFriendlyNames } from '$lib/models/DeckCard';
	import type { OfflineSession, OfflineSessionOutcome } from '$lib/models/OfflineSessionModels';

	export let session: OfflineSession;
	export let outcome: OfflineSessionOutcome;

	let showMore = false;
</script>

<div class="flex flex-col gap-2 col-span-1">
	<h4 class="mt-0">Runda: {outcome.round}</h4>
	<div class="flex flex-col gap-2">
		<p>
			Vinnare:
			<strong>
				{session.players.find((e) => e.userName === outcome.winner)?.firstName}
				{session.players.find((e) => e.userName === outcome.winner)?.lastName}
			</strong>
			{#if showMore}
				(gick ut på: {outcome.playerCards
					.find((e) => e.userName === outcome.winner)
					?.cards.map((e) => DeckFriendlyNames[e])
					.join(', ')})
			{/if}
			<br />
			Förlorare:
			<strong>
				{session.players.find((e) => e.userName === outcome.loser)?.firstName}
				{session.players.find((e) => e.userName === outcome.loser)?.lastName}
			</strong>
			{#if showMore}
				(gick ut på: {outcome.playerCards
					.find((e) => e.userName === outcome.loser)
					?.cards.map((e) => DeckFriendlyNames[e])
					.join(', ')})
			{/if}
			<br />
			Summa: {outcome.amount} kr
			{#if showMore}
				<br />
				Spelad: {outcome.created.toLocaleString()}
			{/if}
		</p>
		<button class="hover:underline text-left" on:click={() => (showMore = !showMore)}
			>Visa {showMore ? 'mindre' : 'mer'}</button
		>
	</div>
</div>
