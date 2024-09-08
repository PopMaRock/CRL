<script lang="ts">
  import type { ModalComponent, ModalSettings } from "@skeletonlabs/skeleton";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import NewGame from "$components/Dungeon/NewGame.svelte";
  import Carousel from "$components/Main/carousel.svelte";
  import MultiColumn from "$components/Main/multiColumn.svelte";
  const modalStore = getModalStore();

  async function doThing() {
    //fir posting data
    const payload = {
      db: "test",
      collection: "testies",
      payload: {
        name: "test",
        value: 123,
      },
    };
    //fetching data
    const res = await fetch("/api/data?db=test&collection=testies", {
      method: "GET",
    });
    /*
        const res = await fetch('/api/data', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
    });*/
    //check if res status if it's 404
    console.log(res);
    if (res.status === 404) {
      console.log("404");
      return;
    }
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
    } else {
      console.log("Unexpected response status:", res.status);
    }
  }
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
</script>

<div class="mx-16">
  <div class="overflow-hidden h-1/4">
    <div class="max-w-[120vh]">
      <div class="flex items-center justify-between mt-10">
        <h1 class="text-4xl font-bold sm:text-6xl">
          DUNGEON
        </h1>
        <div class="flex gap-x-6 items-center">
          <button
          on:click={createOwnGame}
            class="rounded-md btn variant-filled-primary px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >New Game</button>
          <button class="text-sm font-semibold leading-6"
            >Continue <span aria-hidden="true">→</span></button
          >
        </div>
      </div>
      <div class="mt-10 w-full">
        <Carousel class="min-w-[40vh]"/>
      </div>
      <div class="mt-5 w-full">
        <MultiColumn />
      </div>
    </div>
  </div>
</div>
