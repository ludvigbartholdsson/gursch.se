<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;

	let completePassword: string[] = [];
	let inputs: HTMLInputElement[] = [];
	let completePasswordJoined: string = '';

	function focusNextInput(event: KeyboardEvent, currentIndex: number): void {
		const target = event.target as HTMLInputElement;
		const nextIndex = target.value ? currentIndex + 1 : currentIndex - 1;

		if (completePassword[currentIndex]) {
			completePassword[currentIndex] = target.value;
		} else {
			completePassword.splice(currentIndex, 0, target.value);
		}

		completePasswordJoined = completePassword.join('');

		if (inputs[nextIndex]) {
			inputs[nextIndex].focus();
		}
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2>Logga in på gursch.se</h2>
		<p>
			OBS: @edu.samskolan.se mailadress krävs. Om du inte har ett konto kommer vi att automatiskt
			skapa ett konto för dig nu.
		</p>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" method="POST">
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>Emailadress</label
				>
				<div class="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						placeholder="Endast @edu.samskolan.se"
						required
						class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 !outline-none sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>6-siffrig kod</label
					>
				</div>
				<div class="flex mt-2 space-x-2 rtl:space-x-reverse">
					{#each Array(6) as _, index (index)}
						<div>
							<label for={`code-${index + 1}`} class="sr-only">Code {index + 1}</label>
							<input
								bind:this={inputs[index]}
								type="password"
								maxlength="1"
								on:keyup={(event) => focusNextInput(event, index)}
								id={`code-${index + 1}`}
								class="rounded-md flex items-center justify-center font-semibold text-center border-0 w-12 h-12 text-gray-900 shadow-sm ring-1 text-xl ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset !outline-none focus:ring-indigo-600"
								required
							/>
						</div>
					{/each}
				</div>
				<input
					type="hidden"
					name="password"
					id="password"
					bind:value={completePasswordJoined}
					maxlength="6"
					class="invisible"
					required
				/>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Logga in</button
				>
			</div>
		</form>
		{#if form?.failure}
			<div class="rounded-md mt-4 bg-red-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-red-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium !my-0 text-red-800">
							Det var något fel med din inloggning
						</h3>
						<div class="mt-2 text-sm text-red-700">
							<ul role="list" class="list-disc space-y-1 pl-5">
								<li>{form?.failure.message}</li>
								<li>Status: {form.failure.status}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if form?.success}
			<div class="rounded-md mt-4 bg-green-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-green-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium !my-0 text-green-800">Välkommen till gursch.se!</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>
								Du är nu inloggad och kommer att omdirigeras till din profil inom några sekunder.
							</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
