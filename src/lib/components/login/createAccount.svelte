<script lang="ts">
	let completePassword: string[] = [];
	let inputs: HTMLInputElement[] = [];
	let completePasswordJoined: string = '';

	export let emailAddress: string;

	let userName: string = '';
	let firstName: string = '';
	let lastName: string = '';

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

	function validateUserName(event: any) {
		const pattern = /^[a-z0-9-_]+$/;

		if (pattern.test(event.target.value)) {
			userName = event.target.value;
		} else {
			if (event.target.value.length !== 0) {
				event.target.value = userName;
			}
		}
	}

	function validateName(event: any, isFirstName: boolean) {
		const pattern =
			/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u; // Adjust the regex pattern to include any specific characters you want to allow
		const input = event.target.value
			.split(' ')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		if (pattern.test(input)) {
			if (isFirstName) {
				firstName = input;
			} else {
				lastName = input;
			}
		} else {
			if (event.target.value.length !== 0) {
				if (isFirstName) {
					event.target.value = firstName;
				} else {
					event.target.value = lastName;
				}
			}
		}
	}
</script>

<form class="space-y-6" method="POST" action="?/createAccount">
	<div>
		<label for="userName" class="block text-sm font-medium leading-6 text-gray-900"
			>Användarnamn (kan komma bli offentligt)</label
		>
		<div class="mt-2">
			<input
				value={userName}
				on:input={(e) => validateUserName(e)}
				id="userName"
				name="userName"
				type="text"
				required
				class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 !outline-none sm:text-sm sm:leading-6"
			/>
		</div>
	</div>
	<div>
		<label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">Förnamn</label>
		<div class="mt-2">
			<input
				value={firstName}
				on:input={(e) => validateName(e, true)}
				id="firstName"
				name="firstName"
				autocomplete="given-name"
				type="text"
				required
				class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 !outline-none sm:text-sm sm:leading-6"
			/>
		</div>
	</div>
	<div>
		<label for="lastName" class="block text-sm font-medium leading-6 text-gray-900">Efternamn</label
		>
		<div class="mt-2">
			<input
				value={lastName}
				on:input={(e) => validateName(e, false)}
				id="lastName"
				name="lastName"
				autocomplete="family-name"
				type="text"
				required
				class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 !outline-none sm:text-sm sm:leading-6"
			/>
		</div>
	</div>
	<div>
		<div class="flex items-center justify-between">
			<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
				>6-siffrig kod (Denna används vid inloggning framöver.)</label
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
						pattern="[0-9]*"
						inputmode="numeric"
						on:input={(event) => focusNextInput(event, index)}
						id={`code-${index + 1}`}
						class="rounded-md flex items-center justify-center font-semibold text-center border-0 w-12 h-12 text-gray-900 shadow-sm ring-1 text-xl ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset !outline-none focus:ring-blue-600"
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
			class="invisible"
			required
		/>
		<input
			type="hidden"
			name="emailAddress"
			id="emailAddress"
			bind:value={emailAddress}
			class="invisible"
			required
		/>
	</div>

	<div>
		<button
			type="submit"
			class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>Skapa konto och logga in</button
		>
	</div>
</form>
