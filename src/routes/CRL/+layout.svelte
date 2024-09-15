<script lang="ts">
  import { page } from "$app/stores";
  import SidebarLeft from "$components/Layouts/Main/SidebarLeft.svelte";
  import SidebarRight from "$components/Layouts/SidebarRight.svelte";
  import SidebarRightGame from "$components/Dungeon/SidebarRight.svelte";
  import { AppShell, Drawer, getDrawerStore } from "@skeletonlabs/skeleton";
  import GameIconsSideswipe from "~icons/game-icons/sideswipe";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { DungeonSd } from "$stores/dungeon/DungeonSd";
  import { EngineLlmStore } from "$stores/engine/EngineLlm";
  let url: string;
  $: {
    url = $page.url.pathname;
  }
  const drawerStore = getDrawerStore();
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
      <Drawer
        on:backdrop={$drawerStore.meta?.close()}
        position="right"
        width="60vh"
        rounded="rounded-none"
      >
        {#if $drawerStore.id === "engineRight"}
          <SidebarRight />
        {/if}
        {#if $drawerStore.id === "gameRight"}
          <SidebarRightGame />
        {/if}
      </Drawer>
      <section>
        <button
          type="button"
          class="btn"
          on:click={(event) => {
            event.stopPropagation();
            drawerStore.open({
              id: url.includes("play") ? "gameRight" : "engineRight",
              meta: {
                close: () => {
                  if (url.includes("play")) {
                    DungeonGameSettingsStore.save();
                    if ($DungeonGameSettingsStore.game.sd) {
                      DungeonSd.save(String($DungeonGameSettingsStore.game.id));
                    }
                  } else {
                    EngineLlmStore.save();
                  }
                },
              },
            });
          }}
        >
          <GameIconsSideswipe class="text-xl text-primary-900" /></button
        >
      </section>
    </svelte:fragment>
    <!-- Router Slot -->
    <div class="h-screen flex flex-col">
      <div class="flex-grow">
        <slot />
      </div>
    </div></AppShell
  >
</div>
