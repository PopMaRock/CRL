<script lang="ts">
  import { page } from "$app/stores";
  import SidebarLeft from "$components/Layouts/Main/SidebarLeft.svelte";
  import SidebarRight from "$components/Layouts/SidebarRight.svelte";
  import SidebarRightGame from "$components/Dungeon/SidebarRight.svelte";
  import { AppShell } from "@skeletonlabs/skeleton";

  let currentSidebarRight = SidebarRight;
  $: {
    const url = $page.url.pathname;
    if (url.includes("play")) {
      currentSidebarRight = SidebarRightGame;
    } else {
      currentSidebarRight = SidebarRight;
    }
  }
</script>

<div>
  <AppShell>
    <svelte:fragment slot="sidebarLeft">
      <!-- Hidden below Tailwind's large breakpoint -->
      <div id="sidebar-right" class="h-full lg:block">
        <SidebarLeft />
      </div>
    </svelte:fragment>
	<svelte:fragment slot="sidebarRight">
      <svelte:component this={currentSidebarRight} />
    </svelte:fragment>
    <!-- Router Slot -->
    <div class="h-screen flex flex-col">
      <div class="flex-grow">
        <slot />
      </div>
    </div></AppShell
  >
</div>
