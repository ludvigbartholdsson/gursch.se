<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<svelte:head>
	<title>Gursch.se</title>
</svelte:head>

<div class="container discussionLanding py-12 mx-auto">
	{@html data.discussion.bodyHTML}
</div>

<style lang="postcss">
	:global(.discussionLanding h2) {
		@apply mt-8;
	}
	:global(.discussionLanding a) {
		@apply hover:underline;
	}

	:global(.discussionLanding table) {
		@apply overflow-x-auto whitespace-nowrap block;
	}
</style>
