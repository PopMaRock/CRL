<script lang="ts">
  import { goto } from "$app/navigation";
  import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
  import {
    ArrowRight,
    EllipsisVertical,
    StepBack,
    StepForward,
  } from "lucide-svelte";
  interface GameCard {
    id: string;
    name: string;
    desc: string;
    genre: string;
    image: string;
    lastPlayed: string;
  }
  export let data:GameCard[] = [];
  let pishAndPoop: any[] = [];
  
  let elemMovies: HTMLDivElement;

  function multiColumnLeft(): void {
    let x = elemMovies.scrollWidth;
    if (elemMovies.scrollLeft !== 0)
      x = elemMovies.scrollLeft - elemMovies.clientWidth;
    elemMovies.scroll(x, 0);
  }

  function multiColumnRight(): void {
    let x = 0;
    // -1 is used because different browsers use different methods to round scrollWidth pixels.
    if (
      elemMovies.scrollLeft <
      elemMovies.scrollWidth - elemMovies.clientWidth - 1
    )
      x = elemMovies.scrollLeft + elemMovies.clientWidth;
    elemMovies.scroll(x, 0);
  }
</script>

<h1 class="text-xl font-bold">Recently played</h1>
<div class="p-4 pr-0 relative group max-w-[120vh]">
  <!-- Carousel -->
  <div
    bind:this={elemMovies}
    class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-hidden"
  >
  {#if data.length > 0}
    {#each data as game,index}
      <div
        class="block card card-hover shrink-0 snap-start w-[29vh] h-[40vh] overflow-hidden relative"
      >
        <!-- Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br variant-gradient-primary-secondary opacity-10 pointer-events-none"
        ></div>

        <header
          class="card-header relative w-full"
          style="background-image: url({game.image}); background-size: cover; background-position: center; height: 45%;"
        >
          <!-- Gradient Overlay for Header -->
          <div
            class="absolute inset-0 bg-gradient-to-br variant-gradient-primary-secondary opacity-30 pointer-events-none"
          ></div>

          <div
            class="absolute top-0 left-0 p-2 pl-4 text-white w-full bg-gradient-to-b from-black/30 via-black/30 to-transparent flex items-center justify-between"
          >
            <div>
              <span class="font-bold text-xs"><!-- holder for creator name --></span>
              <span class="font-bold text-xs">{game.lastPlayed} ago</span>
            </div>
            
            <button class="ml-auto" use:popup={{
                event: 'click',
                target: `gameOptionsBox${index}`,
                placement: 'bottom',
                closeQuery: '.listbox-item'
            }}>
                <EllipsisVertical class="w-5 h-5" />
            </button>
            <div class="card w-48 shadow-xl py-2" data-popup={`gameOptionsBox${index}`}>
                <ListBox rounded="rounded-none">
                    <ListBoxItem bind:group={pishAndPoop[index]} name="action" value="edit">Export</ListBoxItem>
                    <ListBoxItem bind:group={pishAndPoop[index]} name="action" value="delete">Delete</ListBoxItem>
                </ListBox>
                <div class="arrow bg-surface-100-800-token" />
            </div>
          </div>
        </header>
        <section class="p-4">
         {game.name}
          <p class="text-sm text-gray-500 mt-2">{game.desc}</p>
        </section>
        <footer class="card-footer flex justify-end">
          <button class="btn variant-ghost-primary btn-sm items-center"
          on:click={async () => { await goto(`/CRL/gamemodes/dungeon/classic/play/${game.id}`); }}
            >Continue <ArrowRight class="w-4 h-4" /></button
          >
        </footer>
      </div>
    {/each}
    {:else}
      <p>No games found</p>
  {/if}
  </div>
  <!-- Button: Left -->
  <button
    type="button"
    class="btn-icon absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    on:click={multiColumnLeft}
  >
    <StepBack />
  </button>
  <!-- Button: Right -->
  <button
    type="button"
    class="btn-icon absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    on:click={multiColumnRight}
  >
    <StepForward />
  </button>
</div>
