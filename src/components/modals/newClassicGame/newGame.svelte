<script lang="ts">
  import { cn, getTokens } from "$utilities/utils";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { ChevronLeft, X } from "lucide-svelte";
  import { onMount } from "svelte";
  export let stage: number;
  let loading = false;
  let tokens: Uint32Array | undefined;
  const modalStore = getModalStore();
  if ($modalStore[0]) console.log($modalStore[0].title);

  // Base Classes
  const cBase = "p-4 shadow-xl space-y-4";
  const cHeader =
    "flex items-center border-b dark:border-gray-700 text-bold text-2xl";
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
  function scenarioClicked(scenarioType: string) {
    console.log(`Scenario clicked: ${scenarioType}`);
    forward();
    // Add your logic here
  }
  function forward() {
    stage === 1
      ? (stage = 2)
      : stage === 2
        ? (stage = 3)
        : stage === 3
          ? makeGame()
          : (stage = 1); //go forward
  }
  function backward() {
    stage === 1
      ? (stage = 1)
      : stage === 2
        ? (stage = 1)
        : stage === 3
          ? (stage = 2)
          : (stage = 1); //go back...
  }
  async function makeGame() {
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    loading = false;
  }
  onMount(() => {
    // Remove focus from any element to stop bullshit default focuses on buttons.
    (document.activeElement as HTMLElement)?.blur();
  });
</script>

{#if $modalStore[0]}
  <div
    class={cn(
      cBase,
      "w-model variant-soft-surface flex min-h-[70vh] max-w-[60vh] flex-col rounded-md ring-4"
    )}
  >
    <header class={cHeader}>
      {#if stage > 1}
        <button
          type="button"
          class="items-center hover:animate-ping"
          title="Back to previous page"
          on:click={() => {
            backward();
          }}
        >
          <ChevronLeft class="h-5 w-5" />
        </button>
      {/if}
      {$modalStore[0].title ?? "(title missing)"}
      <button
        on:click={() => {
          modalStore.close();
        }}
        class="btn ml-auto rounded-lg p-2.5 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-700"
      >
        <X class="h-5 w-5" />
      </button>
    </header>
    {#if loading}
      Loading
    {:else}
      <article class="flex-grow">
        {#if stage === 1}
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
        {:else if stage === 2}
          <!-- story and plot -->
		<input type="text" class="input input-add" placeholder="Game Title" />
    <textarea on:change={(e) => tokens = getTokens(e.target.value)} class="textarea textarea-add overflow-y-auto h-48 w-full" placeholder="Premise. For example: You find yourself in the rugged heartland of Scotland, where you take on the storied mantle of %user_name%, a %user_description% with an uncanny knack for growing the finest barley this side of the Tweed. Life has been grand, filled with laughter, ale, and endless nights spinning tall tales by the hearth. But all that is set to change when word arrives that Fanny Williams, a power-hungry queen from south of the border, has set her sights on your fertile lands. With dreams of conquest dancing in her sinister head, she intends to lay waste to everything you hold dear. You must find a way to stop her, and her armies."></textarea>
         <span class="text-xs">Tokens: {tokens?.length??0}</span>
        {:else if stage === 3}
          <!-- Game settings -->
        {:else}
          <!-- Error -->
          Em...well this is scunnered. Init?<br />
          If it helps, I've no idea what's going on either....
        {/if}
      </article>
    {/if}
    <!--<footer class={cn('modal-footer', parent.regionFooter)}>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={null}>{parent.buttonTextSubmit}</button>
		</footer>-->
  </div>
{/if}
