<script lang="ts">
	import MultiSelect, { type ObjectOption } from 'svelte-multiselect';
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	let multiplier = '5';
	let selectedUsers: ObjectOption[];
	$: selectedUsersStringified = JSON.stringify(selectedUsers);
</script>

<div class="container mx-auto py-12 flex flex-col gap-6">
	<h1>Starta ny online-match nu</h1>
	<form class="space-y-6" method="POST" action="?/createOnlineSession">
		<div>
			<label for="" class="block text-lg mb-2 font-medium leading-6 text-gray-900"
				>Välj medspelare</label
			>

			<MultiSelect
				id="color-select"
				options={data.playableUsers}
				bind:selected={selectedUsers}
				placeholder="Välj alla spelare..."
				allowUserOptions={false}
				createOptionMsg={null}
				required
				let:idx
				let:option
			>
				<p>{option.label}</p>
			</MultiSelect>
			<input
				type="hidden"
				name="users"
				id="users"
				bind:value={selectedUsersStringified}
				class="invisible"
				required
			/>
			<p class="text-sm mt-1">
				Se till att dina medspelare är inloggade och befinner sig här i portalen, så får dem en
				notis längst ner på skärmen att joina.
			</p>
		</div>
		<div>
			<label for="multiplier" class="block text-lg mb-2 font-medium leading-6 text-gray-900"
				>Välj multipel (antal kort förloraren går ut på gånger detta = skuld till vinnaren)</label
			>

			<input
				type="number"
				name="multiplier"
				id="multiplier"
				bind:value={multiplier}
				required={true}
				class="block rounded-md border-0 h-12 px-4 w-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 !outline-none text-xl"
			/>
			<p class="text-sm mt-1">Exempel: går ut på en 5a blir {5 * Number(multiplier)} kr.</p>
		</div>
		<div>
			<label for="allowThrows" class="block text-lg mb-2 font-medium leading-6 text-gray-900"
				>Tillåt att kort slängs (vid mini-gursch brukar detta vara avstängt)</label
			>

			<label class="inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					checked={true}
					name="allowThrows"
					id="allowThrows"
					class="sr-only peer"
				/>
				<div
					class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
				></div>
			</label>
		</div>
		<div>
			<label for="" class="block text-lg mb-2 font-medium leading-6 text-gray-900">Antal kort</label
			>

			<fieldset class="mt-4">
				<legend class="sr-only">Antal kort</legend>
				<div class="space-y-4 sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
					<div class="flex items-center">
						<input
							id="3st"
							name="cards"
							type="radio"
							value="3"
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
						/>
						<label for="3st" class="ml-3 block text-base font-medium leading-6 text-gray-900"
							>3 st</label
						>
					</div>
					<div class="flex items-center">
						<input
							id="5st"
							name="cards"
							value="5"
							type="radio"
							checked
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
						/>
						<label for="5st" class="ml-3 block text-base font-medium leading-6 text-gray-900"
							>5 st</label
						>
					</div>
					<div class="flex items-center">
						<input
							id="7st"
							name="cards"
							value="7"
							type="radio"
							class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
						/>
						<label for="7st" class="ml-3 block text-base font-medium leading-6 text-gray-900"
							>7 st</label
						>
					</div>
				</div>
			</fieldset>
		</div>
		<div>
			<button
				type="submit"
				class="flex w-fit justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>Starta nu</button
			>
		</div>
	</form>
</div>

<style lang="postcss">
	:global(.multiselect) {
		@apply !min-h-10 !py-1 !w-fit ring-1 ring-gray-300 !border-0 focus-within:ring-2 focus-within:ring-blue-600 focus:ring-2 focus:ring-inset focus:ring-blue-600;
	}
</style>
