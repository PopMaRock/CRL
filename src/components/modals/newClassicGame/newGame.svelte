<script lang="ts">
  import Scenarios from "$components/Layouts/DungeonClassic/settings/scenarios.svelte";
  import Story from "$components/Layouts/DungeonClassic/settings/story.svelte";
  import { cn, getTokens } from "$utilities/utils";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { ChevronLeft, X } from "lucide-svelte";
  import { onMount } from "svelte";
  export let stage: number;
  let loading = false;
 
  const modalStore = getModalStore();
  if ($modalStore[0]) console.log($modalStore[0].title);

  // Base Classes
  const cBase = "p-4 shadow-xl space-y-4";
  const cHeader =
    "flex items-center border-b dark:border-gray-700 text-bold text-2xl";

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
      "w-model variant-soft-surface flex min-h-[70vh] w-[60vh] flex-col rounded-md ring-4"
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
      <article class="flex-grow ">
        {#if stage === 1}
          <Scenarios on:scenarioSelected={forward} />
        {:else if stage === 2}
          <!-- story and plot -->
          <Story />
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
