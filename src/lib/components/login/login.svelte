<script lang="ts">
	let completePassword: string[] = [];
	let inputs: HTMLInputElement[] = [];
	let completePasswordJoined: string = '';

	export let emailAddress: string;

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

<div>
	<h3>Välkommen tillbaks!</h3>
	<form class="space-y-6" method="POST" action="?/login">
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
		<input
			type="hidden"
			name="email"
			id="email"
			bind:value={emailAddress}
			maxlength="6"
			class="invisible"
			required
		/>
		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>Fortsätt</button
			>
		</div>
	</form>
</div>
