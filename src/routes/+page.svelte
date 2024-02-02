<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<svelte:head>
	<title>Gursch.se</title>
</svelte:head>

<div class="container py-12 mx-auto">
	{@html data.bodyHTML}
</div>
