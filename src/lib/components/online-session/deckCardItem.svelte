<script lang="ts">
	import type { DeckCard } from '$lib/models/DeckCard';

	export let back: boolean = false;
	export let cardRank: DeckCard;
	export let cardSuit: 'clubs' | 'diamonds' | 'hearts' | 'spades';
</script>

<div class="border border-gray-200 w-fit rounded-md">
	{#if back}
		<img class="rounded-md {$$props.class}" src="/standard-deck/back.png" alt="Back of a card" />
	{:else}
		<img
			class="rounded-md {$$props.class}"
			src="/standard-deck/fronts/{cardRank}_{cardSuit}.png"
			alt="{cardRank} of {cardSuit}"
		/>
	{/if}
</div>
