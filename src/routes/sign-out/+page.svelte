<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	onMount(() => {
		setTimeout(() => {
			window.location.pathname = '/';
			invalidateAll();
		}, 3000);
	});
</script>

<div class="container">
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
				<h3 class="text-sm font-medium !my-0 text-green-800">Hejdå!</h3>
				<div class="mt-2 text-sm text-green-700">
					<p>Du är nu utloggad och kommer att omdirigeras till startsidan inom några sekunder.</p>
				</div>
			</div>
		</div>
	</div>
</div>
