<script lang="ts">
  import TextboxGroup from "$components/Base/FormElements/TextboxGroup.svelte";
  import ImageGallery from "$components/Base/Layouts/Parts/GameImage.svelte";
  import {
    Accordion,
    AccordionItem,
    RadioGroup,
    RadioItem,
    SlideToggle,
  } from "@skeletonlabs/skeleton";
  import Button from "../../Base/FormElements/button.svelte";
  import Textarea from "$components/Base/FormElements/Textarea.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  export let allowGameImageSelect = false;
</script>
{#if allowGameImageSelect}
  <!-- thing for the thing -->
{/if}
<div class="h-full overflow-y-auto">
<ImageGallery onlyGameImage={true}/>
<TextboxGroup
  type="text"
  label="Game Title"
  name="gameTitle"
  title="Enter the title of the game"
  bind:value={$DungeonGameSettingsStore.game.name}
  iconHelp={true}
  helpText="Keep it simple. [No effect on AI Prompt]"
/>
<Textarea
  name="gameDescription"
  label="Game Description"
  title="This is not used in AI prompting. Only for your reference"
  bind:value={$DungeonGameSettingsStore.game.description}
  placeHolder="Enter a description of your game"
/>
<hr class="hr mt-4 border-1 border-gray-300" />
<div>
  <SlideToggle
    name="sd"
    active="variant-filled-primary"
    class="mt-4"
    size="sm"
    bind:checked={$DungeonGameSettingsStore.game.sd}
    >Image generation is {$DungeonGameSettingsStore.game.sd
      ? "enabled"
      : "disabled"}</SlideToggle
  >
</div>
<div>
  <SlideToggle
    name="vo"
    active="variant-filled-primary"
    class="mt-4"
    size="sm"
    bind:checked={$DungeonGameSettingsStore.game.vo}
    >Voice-over is {$DungeonGameSettingsStore.game.vo
      ? "enabled"
      : "disabled"}</SlideToggle
  >
</div>
<hr class="hr mt-4 border-1 border-gray-300" />
<div>
  <SlideToggle
    name="memoryBank"
    active="variant-filled-primary"
    class="mt-4"
    size="sm"
    bind:checked={$DungeonGameSettingsStore.llmTextSettings.memoryBank}
    >Context vector memory is {$DungeonGameSettingsStore.llmTextSettings
      .memoryBank
      ? "on"
      : "off"}</SlideToggle
  >
</div>
<label for="autoSummarize" title="'Local' is not good...">Auto Summarise</label>
<RadioGroup
  name="autoSummarize"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
>
  <RadioItem
    bind:group={$DungeonGameSettingsStore.llmTextSettings.autoSummarise}
    name="justify"
    value={false}>OFF</RadioItem
  >
  <!--<RadioItem
    bind:group={$DungeonGameSettingsStore.llmTextSettings.autoSummarize}
    name="justify"
    value={"local"}>Local LLM</RadioItem
>-->
  <RadioItem
    bind:group={$DungeonGameSettingsStore.llmTextSettings.autoSummarise}
    name="justify"
    value={"main"}>Main LLM</RadioItem
  >
</RadioGroup>
 <!--<div>
 <SlideToggle
    name="convertToUkEnglish"
    active="variant-filled-primary"
    class="mt-4"
    size="sm"
    bind:checked={$DungeonGameSettingsStore.llmTextSettings.convertToUkEnglish}
    >Translate to Traditional English is {$DungeonGameSettingsStore
      .llmTextSettings.convertToUkEnglish
      ? "on"
      : "off"}</SlideToggle
>
</div>-->
<Accordion class="border-1 variant-filled-surface rounded-md mt-5 mb-5">
  <AccordionItem closed>
    <svelte:fragment slot="summary">Advanced</svelte:fragment>
    <svelte:fragment slot="content">

      <div class="flex items-center">
        <label for="historyTruncate" class="label font-bold mr-3"
          >Truncate History from</label
        >
        <RadioGroup
          id="historyTruncate"
          active="variant-filled-primary"
          hover="hover:variant-soft-primary"
        >
          <RadioItem
            bind:group={$DungeonGameSettingsStore.llmTextSettings
              .historyTruncate}
            name="justify"
            value={"middle"}>Middle</RadioItem
          >
          <RadioItem
            bind:group={$DungeonGameSettingsStore.llmTextSettings
              .historyTruncate}
            name="justify"
            value={"start"}>Start</RadioItem
          >
        </RadioGroup>
      </div>
        <TextboxGroup
          type="number"
          label="Summarise after"
          name="summariseAfter"
          title="Summarise after this many messages"
          bind:value={$DungeonGameSettingsStore.llmTextSettings.summariseAfter}
          iconHelp={false}
          helpText="Summarise after this many messages"/>
    </svelte:fragment>
  </AccordionItem>
</Accordion>
<div class="mt-auto flex gap-4">
  <Button class="btn variant-filled-primary w-1/2">Export Game</Button>
  <Button class="btn variant-filled-primary w-1/2">Import Game</Button>
</div>
</div>