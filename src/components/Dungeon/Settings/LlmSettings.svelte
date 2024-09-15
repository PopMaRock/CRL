<script lang="ts">
  import RangeSlider from "$components/Base/FormElements/RangeSlider.svelte";
  import TextboxGroup from "$components/Base/FormElements/TextboxGroup.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { getTokens } from "$utilities/utils";
  import {
    Accordion,
    AccordionItem,
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

<div class="dark:variant-filled-surface pl-2 mt-4 mb-4 rounded-md">
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
<RangeSlider
  title="Temperature"
  name="temperature"
  bind:value={$DungeonGameSettingsStore.llmTextSettings.temperature}
  max={1}
  step={0.1}
/>
<div class="grid grid-cols-2 gap-4">
  <RangeSlider
    title="TopP"
    name="topP"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.topP}
    max={1}
    step={0.05}
  />
  <RangeSlider
    title="TopK"
    name="topK"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.topK}
    max={100}
    step={1}
  />
  <RangeSlider
    title="Presence Penalty"
    name="presencePenalty"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.presencePenalty}
    max={2}
    step={0.1}
  />
  <RangeSlider
    title="Frequency Penalty"
    name="frequencyPenalty"
    bind:value={$DungeonGameSettingsStore.llmTextSettings.frequencyPenalty}
    max={2}
    step={0.1}
  />
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
<Accordion class="border-1 variant-filled-surface rounded-md mt-5 mb-5">
  <AccordionItem closed>
    <svelte:fragment slot="summary">Advanced [NOT IMPLEMENTED]</svelte:fragment>
    <svelte:fragment slot="content">
      <!--<Textarea name="stopString" label="Custom Stop String" class="textarea-add min-h-24 w-1/2" placeHolder="['jim', 'bob', 'dave']"/>-->
      <div>
        <SlideToggle
          name="sd"
          active="variant-filled-primary"
          class="mt-4"
          size="sm"
          bind:checked={$DungeonGameSettingsStore.llmTextSettings.cleanUpText}
          >Text Cleanup is {$DungeonGameSettingsStore.llmTextSettings
            .cleanUpText
            ? "enabled"
            : "disabled"}</SlideToggle
        >
      </div>
    </svelte:fragment>
  </AccordionItem>
</Accordion>
