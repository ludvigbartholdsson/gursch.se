<script lang="ts">
	import { DeckCard } from '$lib/models/DeckCard';
	import DeckCardItem from '$lib/components/online-session/deckCardItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.session);
</script>

<div class="container mx-auto py-12">
	<h1>Runda 1</h1>

	<section class="flex flex-col gap-12">
		{#each data.session.players as player}
			<div>
				<h3>{player.firstName}</h3>
				{#if false}
					<p>Väntar på spelare att ansluta...</p>
				{:else}
					<div class="flex flex-row flex-wrap gap-3">
						{#each new Array(5) as _, i}
							<div class="max-h-52">
								<DeckCardItem class="max-h-52" cardRank={DeckCard.Ace} cardSuit="spades" />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</section>
</div>
