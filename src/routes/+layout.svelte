<script lang="ts">
	import { initializeStores, Modal, storePopup } from '@skeletonlabs/skeleton'
	import { AppShell, Toast } from '@skeletonlabs/skeleton'
	//import { autoModeWatcher } from '@skeletonlabs/skeleton'
	//import type { LayoutData } from './$types'
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import '../app.pcss'
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
	import SidebarLeft from '$components/Layouts/Main/SidebarLeft.svelte'
	import SidebarRight from '$components/Layouts/SidebarRight.svelte'
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })
	initializeStores()
	// Initialize
	//console.log("%cHello. There's nothing for cunts like you round these parts", style)
</script>
<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>
<div>
	<Modal />
	<Toast />

	<AppShell>
		<svelte:fragment slot="sidebarLeft">
			<!-- Hidden below Tailwind's large breakpoint -->
			<div id="sidebar-right" class="h-full lg:block">
			<SidebarLeft /></div>
		</svelte:fragment>
		<svelte:fragment slot="sidebarRight">
				<SidebarRight />
		</svelte:fragment>
		<!-- Router Slot -->
			<slot />
	</AppShell>
</div>
