<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let showInitiatedSessions = 3;
	$: initiatedSessionsToShow = data.initiatedSessions.slice(0, showInitiatedSessions);

	let showParticipatedSessions = 3;
	$: participatedSessionsToShow = data.participatedSessions.slice(0, showParticipatedSessions);
</script>

<div class="container flex flex-col gap-12 mx-auto py-12">
	<div>
		<h1>De offline-matcher som du har startat:</h1>
		<section class="divide-y !pl-0 divide-gray-100">
			{#each initiatedSessionsToShow as session}
				<a
					href="/dashboard/offline-session/{session.sessionId}"
					class="flex flex-col sm:flex-row group text-black justify-between sm:gap-y-0 gap-y-3 gap-x-6 py-5"
				>
					<div class="flex flex-col min-w-0 gap-x-4">
						<h3 class="!mb-1 group-hover:underline">
							Din match mot {session.players.map((e) => e.firstName).join(', ')}
						</h3>
						<p class="font-normal text-lg">Antal kort: {session.cards}</p>
						<p class="font-normal text-lg">Multipel: {session.multiplier}</p>
					</div>
					<div class="shrink-0 sm:flex sm:flex-col sm:items-end">
						<p class="mt-1 text-base leading-5 text-gray-500">
							Spelad: <time datetime="2023-01-23T13:23Z">{session.created.toLocaleString()}</time>
						</p>
					</div>
				</a>
			{:else}
				<p>N/A</p>
			{/each}

			{#if showInitiatedSessions < data.initiatedSessions.length}
				<button
					class="flex w-fit justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					on:click={() => (showInitiatedSessions += 6)}>Visa mer</button
				>
			{/if}
		</section>
	</div>

	<div>
		<h1>De offline-matcher som du har deltagit i:</h1>
		<section class="divide-y !pl-0 divide-gray-100">
			{#each participatedSessionsToShow as session}
				<a
					href="/dashboard/offline-session/{session.sessionId}"
					class="flex flex-col sm:flex-row group text-black justify-between sm:gap-y-0 gap-y-3 gap-x-6 py-5"
				>
					<div class="flex flex-col min-w-0 gap-x-4">
						<h3 class="!mb-1 group-hover:underline">
							Din match mot {session.players.map((e) => e.firstName).join(', ')}
						</h3>
						<p class="font-normal text-lg">Antal kort: {session.cards}</p>
						<p class="font-normal text-lg">Multipel: {session.multiplier}</p>
					</div>
					<div class="shrink-0 sm:flex sm:flex-col sm:items-end">
						<p class="mt-1 text-base leading-5 text-gray-500">
							Spelad: <time datetime="2023-01-23T13:23Z">{session.created.toLocaleString()}</time>
						</p>
					</div>
				</a>
			{:else}
				<p>N/A</p>
			{/each}

			{#if showParticipatedSessions < data.participatedSessions.length}
				<button
					class="flex w-fit justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					on:click={() => (showParticipatedSessions += 6)}>Visa mer</button
				>
			{/if}
		</section>
	</div>
</div>
