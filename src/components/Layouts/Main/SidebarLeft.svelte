<script lang="ts">
	import { page } from '$app/stores'
	import GameIconsWorld from '~icons/game-icons/world'
	import GameIconsDramaMasks from '~icons/game-icons/drama-masks'
	import GameIconsSeaDragon from '~icons/game-icons/sea-dragon'
	import GameIconsTiedScroll from '~icons/game-icons/tied-scroll'
	import GameIconsSpottedBug from '~icons/game-icons/spotted-bug'
	import GameIconsHelp from '~icons/game-icons/help'
	import GameIconsSideswipe from '~icons/game-icons/sideswipe'
	import { AppRail, AppRailAnchor, AppRailTile, Avatar, LightSwitch } from '@skeletonlabs/skeleton'
	import { logicalPropertiesHorizontalSlide } from '$lib/utils/transitions'
	import { onMount } from 'svelte'
	let currentRailCategory: undefined | string = undefined
	$: listboxItemActive = (href: string) =>
		$page.url.pathname?.includes(href) ? 'bg-primary-active-token' : ''
	//variable to manage open/close sidebar
	let open = false
	let div: any
	onMount(() => {
		const handleClickOutside = (event: any) => {
			if (div && !div.contains(event.target)) {
				open = false
			}
		}
		window.addEventListener('click', handleClickOutside)
		return () => {
			window.removeEventListener('click', handleClickOutside)
		}
	})
</script>

<div
	bind:this={div}
	class="bg-surface-50-900-token grid h-full grid-cols-[auto_1fr] overflow-hidden border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<AppRail
		hover="btn.background: bg-transparent hover:bg-surface-50-900-token"
		width="w-20"
		height="h-full"
		border="border-r border-surface-500/30"
	>
		<AppRailAnchor slot="lead" name="home" href="/">
			<svelte:fragment slot="lead"
				><img src="/crl-images/icon_logo.png" class="align-center w-12" /></svelte:fragment
			>
		</AppRailAnchor>
		<!-- Mobile Only -->
		<!-- prettier-ignore -->
		<AppRailTile on:click={()=>open=true} bind:group={currentRailCategory} name="adventures" title="Adventures" value={'/1'}>
        <svelte:fragment slot="lead"><GameIconsSeaDragon class="text-2xl inline-flex"/></svelte:fragment>
    </AppRailTile>
		<!-- prettier-ignore -->
		<AppRailTile on:click={()=>open=true} bind:group={currentRailCategory} name="characters" title="Characters" value={'/2'}>
        <svelte:fragment slot="lead"><GameIconsDramaMasks class="text-2xl inline-flex"/></svelte:fragment>
    </AppRailTile>
		<!-- --- / --- -->
		<AppRailTile
			on:click={() => (open = true)}
			bind:group={currentRailCategory}
			name="worlds"
			title="Worlds"
			value={'/3'}
		>
			<svelte:fragment slot="lead"><GameIconsWorld class="inline-flex text-2xl" /></svelte:fragment>
		</AppRailTile>
		<AppRailTile
			on:click={() => (open = true)}
			bind:group={currentRailCategory}
			name="chronicles"
			value={'/4'}
		>
			<svelte:fragment slot="lead"
				><GameIconsTiedScroll class="inline-flex text-2xl" /></svelte:fragment
			>
		</AppRailTile>
		<hr class="opacity-30" />
		<AppRailTile
			on:click={() => (open = true)}
			bind:group={currentRailCategory}
			name="bugs"
			value={'/5'}
		>
			<svelte:fragment slot="lead"
				><GameIconsSpottedBug class="inline-flex text-xl" /></svelte:fragment
			>
		</AppRailTile>
		<AppRailTile
			on:click={() => (open = true)}
			bind:group={currentRailCategory}
			name="information"
			value={'/6'}
		>
			<svelte:fragment slot="lead"><GameIconsHelp class="inline-flex text-xl" /></svelte:fragment>
		</AppRailTile>
		<svelte:fragment slot="trail">
			<AppRailAnchor title="Account">
				<svelte:fragment slot="lead">
					<div class="flex">
						<Avatar
							src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
							width="w-12"
							rounded="rounded-full"
						/>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="default">
					<div class="pt-2 pb-2 flex h-full items-center justify-center">
						<LightSwitch />
					</div>
				</svelte:fragment>
			</AppRailAnchor>
		</svelte:fragment>
	</AppRail>

	{#if open}
		<section
			class="w-[30vh] space-y-4 overflow-y-auto p-4 pb-20"
			transition:logicalPropertiesHorizontalSlide={{ direction: 'inline', duration: 100 }}
		>
			<div class="mb-10 flex justify-between">
				<div id="app-name">
					<div class="flex flex-col leading-none">
						<div class="text-xl">CRL</div>
						<div class="text-sm">Alpha v0.0.1</div>
					</div>
				</div>
				<div id="open-close-btns" class="flex space-x-1">
					<button type="button" class="btn" on:click={() => (open = false)}
						><GameIconsSideswipe class="text-xl text-primary-900" /></button
					>
				</div>
			</div>
			{#if currentRailCategory == '/1'}
				<a href="/gamemodes/dungeon/">DungeonAI</a><br />
				<hr class="mt-20 opacity-30" />
				<div class="mt-2 font-semibold text-primary-800">Your Adventures</div>
			{:else if currentRailCategory == '2'}
				<p>Characters</p>
			{:else if currentRailCategory == '3'}
				<p>Worlds</p>
			{:else if currentRailCategory == '4'}
				<p>Chronicles</p>
			{:else if currentRailCategory == '5'}
				<p>Bugs</p>
			{:else if currentRailCategory == '6'}
				<p>Information</p>
			{:else}
				<p>Home</p>
			{/if}
		</section>
	{/if}
</div>
