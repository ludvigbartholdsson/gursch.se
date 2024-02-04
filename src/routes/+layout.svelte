<script>
	import '$styles/app.css';
	import Nav from '$lib/components/layout/nav.svelte';
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<title>Sveriges första officiella gursch sida | gursch.se</title>
	<meta
		name="description"
		content="Spela offline, se skulder/vinster, leaderboard, regler o mkt mer. Snart kan man även spela online med sina kära vänner."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<Nav />
<slot />
