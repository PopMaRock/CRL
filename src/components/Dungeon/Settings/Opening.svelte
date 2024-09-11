<script lang="ts">
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { EnginePersonaStore } from "$stores/engine/EnginePersona";
  import { Generator } from "$utilities/Generator/llmGenerator";
  import {
    Accordion,
    AccordionItem,
    getToastStore,
  } from "@skeletonlabs/skeleton";
  import { WandSparkles } from "lucide-svelte";
  let loading = false;
  const toast = getToastStore();
  //---The meaty stuff
  async function genPremise() {
    loading = true;
    try {
      const gen = new Generator();
      $DungeonGameSettingsStore.game.opening = await gen.crlGenerate(
        "game",
        `Write a brief opening to a new role playing adventure which revolves around the user.

        User's name: ${$EnginePersonaStore.persona}
        User's description: ${$EnginePersonaStore.personaDesc.replace('%personaName%', $EnginePersonaStore.persona)}
        Genre: ${$DungeonGameSettingsStore.game.genre}

        You should write in the second person i.e. "You are ${$EnginePersonaStore.persona} a...."`,
        100,
        0.5,
        1,
        0.5,
        1.5,
        false
      );
    } catch (e: any) {
      toast.trigger({
        message: `${e?.toString()}`,
        background: "variant-filled-error",
        timeout: 5000,
      });
    } finally {
      loading = false;
    }
  }
</script>

<div class="dark:variant-filled-surface rounded-md mt-5 mb-5">
  <div class="flex items-center justify-between">
    <label for="opening" class="label pl-3 pt-3 font-semibold text-sm"
      >Opening</label
    >
    <button
      title="Generate opening"
      class="ml-4"
      disabled={loading}
      on:click={genPremise}
    >
      {#if loading}
        <WandSparkles
          class="animate-ping items-center mt-2 ml-4 mr-2 h-5 w-5"
        />
      {:else}
        <WandSparkles class="items-center mt-2 ml-4 mr-2 h-5 w-5" />
      {/if}
    </button>
  </div>
  <textarea
    name="premise"
    class="textarea-add min-h-40 w-full"
    bind:value={$DungeonGameSettingsStore.game.opening}
    placeholder="e.g. You find yourself in the rugged heartland of Alba. Life has been good and you are loved by the locals. However, a power-hungry queen plans to invade your country from the south. You must find a way to stop her armies and save your country."
  ></textarea>
</div>
<Accordion class="border-1 dark:variant-filled-surface rounded-md mt-5 mb-5">
  <AccordionItem closed>
    <svelte:fragment slot="summary">AI Prompt</svelte:fragment>
    <svelte:fragment slot="content">
      <textarea
        name="prompt"
        class="!text-xs textarea-add min-h-40 w-full"
        bind:value={$DungeonGameSettingsStore.llmTextSettings.prompt}
        placeholder="e.g. You find yourself in the rugged heartland of Alba. Life has been good and you are loved by the locals. However, a power-hungry queen plans to invade your country from the south. You must find a way to stop her armies and save your country."
      ></textarea></svelte:fragment
    >
  </AccordionItem>
</Accordion>
