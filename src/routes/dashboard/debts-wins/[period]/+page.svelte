<script lang="ts">
	import { page } from '$app/stores';
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	const SEK = new Intl.NumberFormat('sv-SE', {
		style: 'currency',
		currency: 'SEK'
	});
</script>

<div class="container mx-auto flex flex-col gap-6 py-12">
	<div>
		<h1>Skulder/Vinster</h1>
		<div
			class="order-last flex w-full gap-x-8 text-base font-semibold leading-6 sm:order-none sm:w-auto sm:leading-7"
		>
			<a
				class:text-blue-500={$page.url.pathname.includes('/dashboard/debts-wins/week')}
				class="text-black hover:underline"
				href="/dashboard/debts-wins/week">Denna vecka (mån-sön)</a
			>
			<a
				class:text-blue-500={$page.url.pathname.includes('/dashboard/debts-wins/month')}
				class="text-black hover:underline"
				href="/dashboard/debts-wins/month">Denna månad (1-31)</a
			>
			<a
				class:text-blue-500={$page.url.pathname.includes('/dashboard/debts-wins/all-time')}
				class="text-black hover:underline"
				href="/dashboard/debts-wins/all-time">All-time</a
			>
		</div>
	</div>
	<div class="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
		<dl class="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
			<div class="historyItem !border-l-0">
				<dt class="text-sm font-medium leading-6 text-gray-500">Spelat om</dt>
				<dd class="text-xs font-medium text-gray-700">+4.75%</dd>
				<dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
					{SEK.format(data.summaryHistory.revenue)}
				</dd>
			</div>
			<div class="historyItem">
				<dt class="text-sm font-medium leading-6 text-gray-500">Vunnit</dt>
				<dd class="text-xs font-medium text-rose-600">+54.02%</dd>
				<dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
					{SEK.format(data.summaryHistory.won)}
				</dd>
			</div>
			<div class="historyItem">
				<dt class="text-sm font-medium leading-6 text-gray-500">Förlorat</dt>
				<dd class="text-xs font-medium text-gray-700">-1.39%</dd>
				<dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
					{SEK.format(data.summaryHistory.lost)}
				</dd>
			</div>
			<div class="historyItem">
				<dt class="text-sm font-medium leading-6 text-gray-500">Total vinst/förlust</dt>
				<dd class="text-xs font-medium text-rose-600">+10.18%</dd>
				<dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
					{SEK.format(data.summaryHistory.won - data.summaryHistory.lost)}
				</dd>
			</div>
		</dl>
	</div>
	<div>todo ...</div>
</div>

<style lang="postcss">
	.historyItem {
		@apply lg:border-l flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8;
	}
</style>
