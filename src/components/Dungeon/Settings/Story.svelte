<script lang="ts">
  import Textarea from "$components/Base/FormElements/Textarea.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { EnginePersonaStore } from "$stores/engine/EnginePersona";
  import { crlGenerate } from "$utilities/utils";
  import { WandSparkles } from "lucide-svelte";
  let loading = false;
  async function genStory() {
    loading = true;
    $DungeonGameSettingsStore.game.storySummary = await crlGenerate(
      "game",
      `
        Invent a brief story summary containing interesting things that may have happened since the stated Opening.
        You should include the next primary plot, goal and antagonist in the story.

        User's name: ${$EnginePersonaStore.persona}
        User's description: ${$EnginePersonaStore.persona}
        Genre: ${$DungeonGameSettingsStore.game.genre}

        ${`\nOpening: ${$DungeonGameSettingsStore.game.opening}` ?? ""}${
          `\nPlot Essentials: ${$DungeonGameSettingsStore.game.plotEssentials}` ??
          ""
        }${`\n${$DungeonGameSettingsStore.game.authorsNotes}` ?? ""}

        You should write in the second person, for example "You find yourself..."
        You should respond in a paragraph. Do not create lists or structured formatting.
        Write a maximum of 150 words.`,
      300,
      0.7,
      1,
      0.5,
      1.5,
      false
    );
    loading = false;
  }
</script>

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
