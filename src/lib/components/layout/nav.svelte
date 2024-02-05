<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	let navOpen = false;
	let accountNavOpen = false;

	let navItems = [
		{ name: 'Regler', href: '/', showWhenAuthenticated: true, showWhenNotAuthenticated: true },
		{
			name: 'Logga in',
			href: '/login',
			showWhenAuthenticated: false,
			showWhenNotAuthenticated: true
		},
		{
			name: 'Portalen',
			href: '/dashboard',
			showWhenAuthenticated: true,
			showWhenNotAuthenticated: false
		},
		{
			name: 'Leaderboard',
			href: '/leaderboard',
			showWhenAuthenticated: true,
			showWhenNotAuthenticated: true
		}
	];

	const accountNavItems = [
		{
			name: 'Spela offline nu',
			href: '/dashboard/offline-session'
		},
		{
			name: 'Se skulder/vinster',
			href: '/dashboard/debts-wins/week'
		},
		{
			name: 'Inställningar',
			href: '/dashboard/settings'
		},
		{
			name: 'Logga ut',
			href: '/sign-out'
		}
	];

	$: {
		if ($page.data.user) {
			navItems = navItems.filter((e) => e.showWhenAuthenticated);
		} else {
			navItems = navItems.filter((e) => e.showWhenNotAuthenticated);
		}
	}

	beforeNavigate(() => {
		accountNavOpen = false;
		navOpen = false;
	});
</script>

<nav class="bg-white shadow">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-16 justify-between">
			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<button
					type="button"
					class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
					aria-controls="mobile-menu"
					aria-expanded="false"
					on:click={() => (navOpen = !navOpen)}
				>
					<span class="absolute -inset-0.5"></span>
					<span class="sr-only">Open main menu</span>
					<svg
						class:hidden={navOpen}
						class="block h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
					<svg
						class:hidden={!navOpen}
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div class="flex flex-shrink-0 items-center">
					<a href="/"><h3>Gursch.se</h3></a>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					{#each navItems as item}
						<a
							href={item.href}
							class="navItem"
							class:navItemActive={$page.url.pathname === item.href}>{item.name}</a
						>
					{/each}
				</div>
			</div>
			{#if $page.data?.user}
				<div class="hidden sm:ml-6 sm:flex sm:items-center">
					<div class="relative ml-3">
						<div class="flex flex-row items-center gap-3">
							<p>{$page.data.user?.firstName} {$page.data.user?.lastName}</p>
							<button
								type="button"
								class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
								aria-controls="mobile-menu"
								aria-expanded="false"
								on:click={() => (accountNavOpen = !accountNavOpen)}
							>
								<span class="absolute -inset-0.5"></span>
								<span class="sr-only">Open main menu</span>
								<svg
									class:hidden={accountNavOpen}
									class="block h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
								<svg
									class:hidden={!accountNavOpen}
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div
							class:hidden={!accountNavOpen}
							class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="user-menu-button"
							tabindex="-1"
						>
							{#each accountNavItems as item}
								<a
									href={item.href}
									class="mobileNavItem"
									class:mobileNavItemActive={$page.url.pathname === item.href}>{item.name}</a
								>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class:hidden={!navOpen} class="sm:hidden" id="mobile-menu">
		<div class="space-y-1 pb-4 pt-2">
			{#each navItems as item}
				<a
					href={item.href}
					class="mobileNavItem"
					class:mobileNavItemActive={$page.url.pathname === item.href}>{item.name}</a
				>
			{/each}
		</div>
		{#if $page.data?.user}
			<div class="border-t border-gray-200 pb-3 pt-4">
				<div class="flex items-center px-4">
					<div>
						<div class="text-base font-medium text-gray-800">
							{$page.data.user?.firstName}
							{$page.data.user?.lastName}
						</div>
						<div class="text-sm font-medium text-gray-500">{$page.data.user?.emailAddress}</div>
					</div>
				</div>
				<div class="mt-3 space-y-1">
					{#each accountNavItems as item}
						<a
							href={item.href}
							class="mobileNavItem"
							class:mobileNavItemActive={$page.url.pathname === item.href}>{item.name}</a
						>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</nav>

<style lang="postcss">
	.navItem {
		@apply inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700;
	}

	.mobileNavItem {
		@apply block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700;
	}

	.mobileNavItemActive {
		@apply !bg-blue-50 !border-blue-500 !text-blue-700;
	}

	.navItemActive {
		@apply !border-blue-500 !text-gray-900;
	}
</style>
