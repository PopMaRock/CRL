<script lang="ts">
  import Textarea from "$components/Base/FormElements/Textarea.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { EnginePersonaStore } from "$stores/engine/EnginePersona";
  import { Generator } from "$utilities/Generator/llmGenerator";
  import { toastr } from "$utilities/toastr";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import { WandSparkles } from "lucide-svelte";
  let loading = false;
  async function genStory() {
    loading = true;
    const gen = new Generator();
    $DungeonGameSettingsStore.game.storySummary = await gen.crlGenerate({
      weAre: "game",
      prompt: `
        Invent a brief story summary containing interesting things that may have happened since the stated Opening.
        You should include the next primary plot, goal and antagonist in the story.

        User's name: ${$EnginePersonaStore.persona}
        User's description: ${$EnginePersonaStore.persona}
        Genre: ${$DungeonGameSettingsStore.game.genre}

        ${`${$DungeonGameSettingsStore.game.opening ? `\nOpening: ${$DungeonGameSettingsStore.game.opening}` : ""}`}
        ${`${$DungeonGameSettingsStore.game.plotEssentials ? `\nPlot Essentials: ${$DungeonGameSettingsStore.game.plotEssentials}` : ""}`}
        ${`${$DungeonGameSettingsStore.game.authorsNotes ? `\n${$DungeonGameSettingsStore.game.authorsNotes}` : ""}`}

        You should write in the second person, for example "You find yourself..."
        You should respond in a paragraph. Do not create lists or structured formatting.
        Write a maximum of 100 words.`,
      maxTokens: 200,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0.5,
      presencePenalty:1.5,
  });
    loading = false;
  }
    async function genPremise() {
    loading = true;
    try {
       const gen = new Generator();
      $DungeonGameSettingsStore.game.opening = await gen.crlGenerate({
        weAre: "game",
        prompt: `Write a brief opening to a new role playing adventure which revolves around the user.

        User's name: ${$EnginePersonaStore.persona}
        User's description: ${$EnginePersonaStore.personaDesc.replace("%personaName%", $EnginePersonaStore.persona)}
        Genre: ${$DungeonGameSettingsStore.game.genre}

        You should write in the second person i.e. "You are ${$EnginePersonaStore.persona} a...."`,
        maxTokens: 100,
        temperature: 0.5,
        topP: 1,
        frequencyPenalty:0.5,
        presencePenalty: 1.5
    });
    } catch (e: any) {
      toastr({
        message: `${e?.toString()}`,
        type: "error",
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
<div class="dark:variant-filled-surface rounded-md mt-5 mb-5">
  <div class="flex items-center justify-between">
    <label for="summary" class="pl-3 pt-3 font-semibold text-sm"
      >Story Summary (optional)</label
    >
    <button title="Generate opening" class="ml-4" disabled={loading} on:click={genStory}>
      {#if loading}
      <WandSparkles class="animate-ping items-center mt-2 ml-4 mr-2 h-5 w-5" />
      {:else}
      <WandSparkles class="items-center mt-2 ml-4 mr-2 h-5 w-5" />
      {/if}
    </button>
  </div>
  <textarea
    name="storySummary"
    class="textarea-add min-h-28 w-full"
    bind:value={$DungeonGameSettingsStore.game.storySummary}
    placeholder="A summary of the adventure. The AI will always use this when generating new responses."
  ></textarea>
</div>
<Textarea
  name="plotEssentials"
  label="Plot Essentials (optional)"
  title="Enter important information about the adventure. The AI will always use this when generating new responses."
  bind:value={$DungeonGameSettingsStore.game.plotEssentials}
  placeHolder="Enter important information about the adventure. The AI will always use this when generating new responses."
/>

<Textarea
  name="authorsNotes"
  label="Authors notes (optional)"
  title="Enter important information about the adventure. The AI will always use this when generating new responses."
  bind:value={$DungeonGameSettingsStore.game.authorsNotes}
  placeHolder="e.g. Writing style: dramatic, dramatic, vivid prose. Theme: fantasy, adventure. Mood: Witty, humorous, light-hearted."
/>
