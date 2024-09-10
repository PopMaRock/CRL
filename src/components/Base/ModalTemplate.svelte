<script lang="ts">
  import { cn } from "$utilities/utils";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { ChevronLeft, X } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  export let stage = 1;
  export let showBackButton = true;
  export let showFooterButtons = true;
  export let showPositiveBtn = true;
  export let showNegativeBtn = false;
  export let positiveBtn = "Create";
  export let negativeBtn = "Cancel";
  const dispatch = createEventDispatcher();
  //--
  const modalStore = getModalStore();
  if ($modalStore[0]) console.log($modalStore[0].title);
  // Base Classes
  const cHeader =
    "flex items-center border-b dark:border-gray-700 text-bold text-2xl";
</script>

{#if $modalStore[0]}
  <div
    class={cn(
      `${$$props.class}`,
      `w-model dark:bg-surface-600 bg-white flex flex-col rounded-md ring-4 p-4 shadow-xl space-y-4`
    )}
  >
    <header class={cHeader}>
      {#if stage > 1 && showBackButton}
        <button
          type="button"
          class="items-center hover:animate-ping"
          title="Back to previous page"
          on:click={() => {
            dispatch("back");
          }}
        >
          <ChevronLeft class="h-5 w-5" />
        </button>
      {/if}
      {$modalStore[0].title ?? "(title missing)"}
      <button
        on:click={() => {
          dispatch("close");
          modalStore.close();
        }}
        class="btn ml-auto rounded-lg p-2.5 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-700"
      >
        <X class="h-5 w-5" />
      </button>
    </header>
    <article class="flex-grow overflow-y-auto focus:border-0">
      <slot />
    </article>
    <footer class="modal-footer">
      {#if showFooterButtons}
        <div class="flex justify-end space-x-2">
          {#if showNegativeBtn}
          <button
            class="btn"
            on:click={() => {
              modalStore.close();
            }}>{negativeBtn}</button
          >
          {/if}
          {#if showPositiveBtn}
          <button class="btn variant-filled-primary" on:click={()=>dispatch('positiveClick')}>{positiveBtn}</button>
          {/if}
        </div>
      {/if}
    </footer>
  </div>
{/if}
