<script lang="ts">
  import Textarea from "$components/Main/Forms/Textarea.svelte";
import TextboxGroup from "$components/Main/Forms/TextboxGroup.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon";
  import { getTokens } from "$utilities/utils";
  import {
    Accordion,
    AccordionItem,
    RangeSlider,
    SlideToggle,
  } from "@skeletonlabs/skeleton";
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
  <SlideToggle
    name="streaming"
    active="variant-filled-primary"
    class="mt-4"
    size="sm"
    bind:checked={$DungeonGameSettingsStore.llmTextSettings.stream}
    >Streaming {$DungeonGameSettingsStore.llmTextSettings.stream
      ? "On"
      : "Off"}</SlideToggle
  >
</div>

<div class="variant-filled-surface pl-2 mt-4 mb-4 rounded-md">
  <TextboxGroup
    label="Limit Context"
    name="limitContext"
    type="number"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.limitContext}
    placeholder="4096"
  />
  <TextboxGroup
    label="Limit Response Length"
    name="limitResponseLength"
    type="number"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.defaultGenNum}
    placeholder="100"
    iconHelp={true}
    helpText="If the AI is talking too much, reduce this"
  />
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
    <svelte:fragment slot="summary">Advanced [NOT IMPLEMENTED]</svelte:fragment>
    <svelte:fragment slot="content">
      <!--<Textarea name="stopString" label="Custom Stop String" class="textarea-add min-h-24 w-1/2" placeHolder="['jim', 'bob', 'dave']"/>-->
     </svelte:fragment
    >
  </AccordionItem>
</Accordion>
