<form class="space-y-6" method="POST" action="?/accountExists">
	<div>
		<label for="email" class="block text-sm font-medium leading-6 text-gray-900">Emailadress</label>
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
		<button
			type="submit"
			class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>Fortsätt</button
		>
	</div>
</form>
