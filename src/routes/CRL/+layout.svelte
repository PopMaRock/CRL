<script lang="ts">
	import SidebarLeft from '$components/Layouts/Main/SidebarLeft.svelte'
	import SidebarRight from '$components/Layouts/SidebarRight.svelte'
  import { AppShell } from '@skeletonlabs/skeleton';
</script>
<div>

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
				<div class="h-screen flex flex-col">
			<div class="flex-grow">
				<slot />
			</div>
	</AppShell>
</div>
