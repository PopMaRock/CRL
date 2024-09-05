<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { onMount, tick } from "svelte";
  import Modal from "../ModalTemplate.svelte";
  import Scenarios from "./Settings/Scenarios.svelte";
  import Details from "./Settings/Premise.svelte";
  import Story from "./Settings/Story.svelte";
  import GameSettings from "./Settings/GameSettings.svelte";
  import LlmSettings from "./Settings/LlmSettings.svelte";
  import {
    DungeonGameSettingsDefault,
    DungeonGameSettingsStore,
  } from "$stores/dungeon";
  import { EngineLlmStore } from "$stores/engine";
  export let stage: number;
  let loading = false;

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
    stage === 1 ? (stage = 1) : (stage = 2);
  }
  async function makeGame() {
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    loading = false;
  }
  onMount(async () => {
    console.log("New Game");
    // Remove focus from any element to stop wanky default focuses on buttons.
    (document.activeElement as HTMLElement)?.blur();

    // Clear the DungeonGameSettingsStore
    DungeonGameSettingsStore.set(DungeonGameSettingsDefault);
    await tick(); //wait pending changes
    //Merge in user defaults from EngineLlmStore
    DungeonGameSettingsStore.update((s:DungeonGameSettings) => {
      return s.llmTextSettings = {
        ...s,
        llmActive: $EngineLlmStore.llmActive,
        ...$EngineLlmStore.llmTextSettings,
      };
    });
    await tick(); //wait pending changes
    
  });
  let storyTab = 0;
</script>

<Modal
  title="New Game"
  {stage}
  class="min-h-[70vh] min-h-[80vh] w-[60vh]"
  on:back={backward}
>
  {#if loading}
    Loading
  {:else if stage === 1}
    <Scenarios on:scenarioSelected={forward} />
  {:else if stage === 2}
    <!-- story and plot -->
    <TabGroup>
      <Tab bind:group={storyTab} name="tab1" value={0}>Premise</Tab>
      <Tab bind:group={storyTab} name="tab2" value={1}>Story</Tab>
      <Tab bind:group={storyTab} name="tab4" value={2}>Game Settings</Tab>
      <Tab bind:group={storyTab} name="tab5" value={3}>LLM Settings</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if storyTab === 0}
          <Details />
        {:else if storyTab === 1}
          <Story />
        {:else if storyTab === 2}
          <GameSettings />
        {:else if storyTab === 3}
          <LlmSettings />
        {/if}
      </svelte:fragment>
    </TabGroup>
  {:else}
    <!-- Error -->
    Em...well this is scunnered. Init?<br />
    If it helps, I've no idea what's going on either....
  {/if}
</Modal>
