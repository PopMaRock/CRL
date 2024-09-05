<script lang="ts">
  import { DungeonGameSettingsStore } from "$stores/dungeon";
  import { EngineLlmStore } from "$stores/engine";
  import { getTokens } from "$utilities/utils";
  import { Accordion, AccordionItem, RangeSlider, SlideToggle } from "@skeletonlabs/skeleton";
  import { BadgeHelp } from "lucide-svelte";
  import { onMount } from "svelte";

  let tokens: Uint32Array | undefined;
  onMount(async () => {
    tokens = await getTokens("");
  });
</script>

<div class="text-lg ml-1 mt-5">
  Initial prompt will use {tokens?.length ?? 0} tokens
</div>

<div>
  <SlideToggle name="streaming" active="variant-filled-primary" class="mt-4" size="sm" bind:checked={$DungeonGameSettingsStore.llmTextSettings.stream}>Streaming {$DungeonGameSettingsStore.llmTextSettings.stream? 'On':'Off'}</SlideToggle>
</div>

<div class="variant-filled-surface pl-2 pt-2 mt-4 mb-4 rounded-md">
  <label for="limitContext" class="label font-bold">Limit Context</label>
  <div
    class="input-add border-0 input-group input-group-divider grid-cols-[1fr_auto]"
  >
    <input
      id="limitContext"
      type="number"
      name="limitContext"
      class=""
      bind:value={$DungeonGameSettingsStore.llmTextSettings.limitContext}
    />
    <span title="Context reduction will sacrifice long term memory first"
      ><BadgeHelp class="items-center mt-2 ml-4 mr-2 h-5 w-5" /></span
    >
  </div>

  <label for="defaultGenNum" class="label font-bold">Limit Response Length</label>
  <div
    class="input-add border-0 input-group input-group-divider grid-cols-[1fr_auto]"
  >
    <input
      id="defaultGenNum"
      type="number"
      name="defaultGenNum"
      class=""
      bind:value={$DungeonGameSettingsStore.llmTextSettings.defaultGenNum}
    />
    <span title="If the AI is talking too much, reduce this"
      ><BadgeHelp class="items-center mt-2 ml-4 mr-2 h-5 w-5" /></span
    >
  </div>
</div>

<div>
  <RangeSlider
    name="temperature"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.temperature}
    max={1}
    step={0.1}
    ticked
  >
    <div class="flex justify-between items-center">
      <div class="font-bold" title="Temperature">Randomness</div>
      <div class="text-xs">
        {$DungeonGameSettingsStore.llmTextSettings.temperature} / 1
      </div>
    </div>
  </RangeSlider>
</div>
<div class="grid grid-cols-2 gap-4">
  <div>
    <RangeSlider
      name="topP"
      bind:value={$DungeonGameSettingsStore.llmTextSettings.topP}
      max={1}
      step={0.05}
      ticked
    >
      <div class="flex justify-between items-center">
        <div class="font-bold">Top P</div>
        <div class="text-xs">
          {$DungeonGameSettingsStore.llmTextSettings.topP} / 1
        </div>
      </div>
    </RangeSlider>
  </div>
  <div>
    <RangeSlider
      name="topK"
      bind:value={$DungeonGameSettingsStore.llmTextSettings.topK}
      max={100}
      step={1}
      ticked
    >
      <div class="flex justify-between items-center">
        <div class="font-bold">Top K</div>
        <div class="text-xs">
          {$DungeonGameSettingsStore.llmTextSettings.topK} / 100
        </div>
      </div>
    </RangeSlider>
  </div>
  <div>
    <RangeSlider
      name="presencePenalty"
      bind:value={$DungeonGameSettingsStore.llmTextSettings.presencePenalty}
      max={2}
      step={0.1}
      ticked
    >
      <div class="flex justify-between items-center">
        <div class="font-bold">Presence Penalty</div>
        <div class="text-xs">
          {$DungeonGameSettingsStore.llmTextSettings.presencePenalty} / 2
        </div>
      </div>
    </RangeSlider>
  </div>
  <div>
    <RangeSlider
      name="frequencyPenalty"
      bind:value={$DungeonGameSettingsStore.llmTextSettings.frequencyPenalty}
      max={2}
      step={0.1}
      ticked
    >
      <div class="flex justify-between items-center">
        <div class="font-bold">Frequency Penalty</div>
        <div class="text-xs">
          {$DungeonGameSettingsStore.llmTextSettings.frequencyPenalty} / 2
        </div>
      </div>
    </RangeSlider>
  </div>
</div>
<Accordion class="border-1 variant-filled-surface rounded-md mt-5 mb-5">
  <AccordionItem closed>
    <svelte:fragment slot="summary">Advanced</svelte:fragment>
    <svelte:fragment slot="content"
      >
        <textarea
          name="prompt"
          class="!text-xs textarea-add min-h-40 w-full"
          bind:value={$DungeonGameSettingsStore.llmTextSettings.prompt}
          placeholder="e.g. You find yourself in the rugged heartland of Alba. Life has been good and you are loved by the locals. However, a power-hungry queen plans to invade your country from the south. You must find a way to stop her armies and save your country."
        ></textarea></svelte:fragment
    >
  </AccordionItem>
</Accordion>
