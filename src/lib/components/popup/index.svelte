<script lang="ts">
	export let header: string;
	export let description: string;
</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

	<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
		<div class="flex min-h-full w-full items-center justify-center p-4 sm:p-0">
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 w-full text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
			>
				<div class="text-start">
					<h3 class="!my-0" id="modal-title">
						{header}
					</h3>
					<div class="!my-0">
						<p>
							{description}
						</p>
					</div>
				</div>

				<slot />
			</div>
		</div>
	</div>
</div>
