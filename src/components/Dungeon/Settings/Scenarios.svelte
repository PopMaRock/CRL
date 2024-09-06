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
      image: "path/to/fantasy.jpg",
    },
    {
      name: "Space",
      image: "path/to/space.jpg",
    },
    {
      name: "Cyberpunk",
      image: "path/to/cyberpunk.jpg",
    },
    {
      name: "Horror",
      image: "path/to/horror.jpg",
    },
    {
      name: "Mystery",
      image: "path/to/mystery.jpg",
    },
    {
      name: "Steampunk",
      image: "path/to/romance.jpg",
    },
    {
      name: "Comedy",
      image: "path/to/comedy.jpg",
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