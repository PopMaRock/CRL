<script lang="ts">
  import { createEventDispatcher } from "svelte";

     
     const dispatch = createEventDispatcher();
     const scenarios = [
    {
      name: "Random",
      image: "dice/diceBase.png",
    },
    {
      name: "Custom",
      image: "blankStory/storyBase.png",
    },
    {
      name: "Fantasy",
      image: "dummy-image-square.jpg",
    },
    {
      name: "Space",
      image: "dummy-image-square.jpg",
    },
    {
      name: "Cyberpunk",
      image: "dummy-image-square.jpg",
    },
    {
      name: "Horror",
      image: "dummy-image-square.jpg",
    },
    {
      name: "Mystery",
      image: "dummy-image-square.jpg",
    },
    {
      name: "Steampunk",
      image: "dummy-image-square.jpg",
    },
    {
      name: "Comedy",
      image: "dummy-image-square.jpg",
    },
  ];
  function scenarioClicked(scenario: string) {
    console.log(`Scenario clicked: ${scenario}`);
    dispatch('scenarioSelected', scenario);
    // Add your logic here
  }
</script>
 <!-- scenario -->
 <div class="grid w-full grid-cols-3 gap-1">
    {#each scenarios as scenario}
        <button
            class="variant-soft-surface flex flex-col min-h-40 min-w-40 items-center justify-center rounded-md hover:bg-surface-700"
            on:click={() => scenarioClicked(scenario.name)}
        >
            <img
                src={`/images/interface/newGame/${scenario.image}`}
                alt={scenario.name}
                class="h-24 w-24 mb-2"
            />
            {scenario.name}
        </button>
    {/each}
</div>