<script lang="ts">
  import { DungeonGameSettingsStore } from "$stores/dungeon";
  import { WandSparkles } from "lucide-svelte";

</script>
<div class="variant-filled-surface rounded-md mt-5 mb-5">
    <div class="flex items-center justify-between">
    <label for="summary" class="pl-3 pt-3 font-semibold text-sm">Story Summary (optional)</label>
    <button title="Generate summary" class="ml-4">
      <WandSparkles class="items-center mt-2 ml-4 mr-2 h-5 w-5"/>
    </button>
  </div>
  <textarea
    name="premise"
    class="textarea-add min-h-28 w-full"
    bind:value={$DungeonGameSettingsStore.game.premise}
    placeholder="A summary of the adventure. The AI will always use this when generating new responses."
  ></textarea>
</div>
<div class="variant-filled-surface rounded-md mt-5 mb-5">
  <label for="plotEssentials" class="pl-3 pt-3 font-semibold text-sm">Plot Essentials (optional)</label>
  <textarea
    name="plotEssentials"
    class="textarea-add min-h-22 w-full"
    bind:value={$DungeonGameSettingsStore.game.plotEssentials}
    placeholder="Enter important information about the adventure. The AI will always use this when generating new responses."
  ></textarea>
</div>
<div class="variant-filled-surface rounded-md mt-5 mb-5">
  <label for="authorsNotes" class="pl-3 pt-3 font-semibold text-sm">Authors notes (optional)</label>
  <textarea
    name="authorsNotes"
    class="textarea-add min-h-24 w-full"
    bind:value={$DungeonGameSettingsStore.game.authorsNotes}
    placeholder="e.g. Writing style: dramatic, dramatic, vivid prose. Theme: fantasy, adventure. Mood: Witty, humorous, light-hearted."
  ></textarea>
</div>
