<script lang="ts">
	import AccountExists from '$lib/components/login/accountExists.svelte';
	import CreateAccount from '$lib/components/login/createAccount.svelte';
	import FinalizeLogin from '$lib/components/login/login.svelte';
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<div class="flex min-h-full gap-6 flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2>Logga in på gursch.se</h2>
		<p>Om du inte har ett konto kommer vi att automatiskt skapa ett konto för dig nu.</p>
	</div>

	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		{#if !form || typeof form?.accountExists === 'undefined'}
			<AccountExists />
		{/if}

		{#if form && form?.accountExists === false}
			<CreateAccount emailAddress={form.emailAddress} />
		{/if}

		{#if form && form?.accountExists === true}
			<FinalizeLogin emailAddress={form.emailAddress} />
		{/if}

		{#if form && form?.failure}
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
	</div>
</div>
