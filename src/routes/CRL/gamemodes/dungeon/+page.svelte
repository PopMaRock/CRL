<script lang="ts">
  import type { ModalComponent, ModalSettings } from "@skeletonlabs/skeleton";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import NewGame from "$components/Dungeon/NewGame.svelte";
  import Carousel from "$components/Base/Layouts/Parts/carousel.svelte";
  import MultiColumn from "$components/Base/Layouts/Parts/multiColumn.svelte";
  import { formatTimeAgo } from "$utilities/utils";
  import { dbGet } from "$utilities/data/db";
  const modalStore = getModalStore();
  const modalComponent: ModalComponent = {
    ref: NewGame,
    props: { stage: 1 },
  };
  async function createOwnGame() {
    const modal: ModalSettings = {
      type: "component",
      title: "New Adventure",
      backdropClasses: "",
      component: modalComponent,
      // Returns the updated response value
      response: (r: string) => console.log("response:", r),
    };
    /*
        Choose a scenario
        -- Random (AI generates it)
        -- Blank (User write it)
        -- Fantasy (AI generates it)
        -- Space (AI generates it)
        -- Cyberpunk (AI generates it)
        -- Horror (AI generates it)
        -- Mystery (AI generates it)
        -- Steampunk (AI generates it)
        -- Comedy (AI generates it)

        Then pick story elements - Enhanced will take world, characters, items, magic etc... into consideration.
        
        Story:
        --Opening Story (Premise)
        --Authors notes (Writing style: Elegant, dramatic, vivid prose. Theme: fantasy, adventure.)
        --Plot Essentials (hidden)
        --Story Summary (hidden) -- story so far
        --AI Prompt (hidden) -- AI full prompt
        --Enable third person (hidden) -- need to switch off all the functions that change text to second person.
        Details:
        Use the game settings component
        -----Title
        -----Description
        -----Tags (max 10)
        -----Content Rating (fuck knows how to handle this just now)
        -----Import / Export (will figure this out later)
        Settings:
        Just use the game settings component
        */
    modalStore.trigger(modal);
  }

  async function getRecentlyPlayed() {
    const data = await dbGet({ db: "CRL", collection: "dungeons" });
    if(!data || data?.error) return []

    // Convert the object to an array of game objects
    const dataArray = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    //sort by game.meta.lastPlayed DESC
    dataArray.sort((a, b) => {
      const dateA = new Date(a?.meta?.lastPlayed).getTime();
      const dateB = new Date(b?.meta?.lastPlayed).getTime();
      return dateB - dateA;
    });
    const recentlyPlayed = dataArray.map((game: any) => ({
      id: game.id,
      name: game.name,
      desc:
        game.desc && game.desc.trim() !== ""
          ? game.desc
          : "This is a filler description that only exists as an example of what things look like.",
      genre: game.genre,
      image: game.image,
      lastPlayed: formatTimeAgo(game?.meta?.lastPlayed),
    }));

    console.log("Recently played", recentlyPlayed);
    return recentlyPlayed;
  }
</script>

<div class="mx-16">
  <div class="overflow-hidden h-1/4">
    <div class="max-w-[120vh]">
      <div class="flex items-center justify-between mt-10">
        <h1 class="text-4xl font-bold sm:text-6xl">DUNGEON</h1>
        <div class="flex gap-x-6 items-center">
          <button
            on:click={createOwnGame}
            class="rounded-md btn variant-filled-primary px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >New Game</button
          >
          <button class="text-sm font-semibold leading-6"
            >Continue <span aria-hidden="true">→</span></button
          >
        </div>
      </div>
      <div class="mt-10 w-full">
        <Carousel class="min-w-[40vh]" />
      </div>
      <div class="mt-5 w-full">
        {#await getRecentlyPlayed()}
          Loading....
        {:then games}
          <MultiColumn data={games} />
        {/await}
      </div>
    </div>
  </div>
</div>
