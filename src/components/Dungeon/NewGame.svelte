<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { onMount, tick } from "svelte";
  import Modal from "../ModalTemplate.svelte";
  import Scenarios from "./Settings/Scenarios.svelte";
  import Opening from "./Settings/Opening.svelte";
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
    stage = (stage === 1)
      ?  2
      : (stage === 2)
        ? 3
        : stage === 3
          ? 0
          : 1; //go forward
  }
  function backward() {
    console.log(`Backward${stage}`);
    stage = 1;
    console.log(`Changed${stage}`);
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
  function scenarioSelected(event: CustomEvent) {
    console.log(event);
    if(!event.detail) return;
    $DungeonGameSettingsStore.game.genre = event.detail;
    forward();
  }
  let storyTab = 0;
</script>

<Modal
  title="New Game"
  {stage}
  class="min-h-[82vh] max-h-[82vh] w-[60vh]"
  on:back={backward}
>
  {#if loading}
    Loading
  {:else if stage === 1}
    <Scenarios on:scenarioSelected={scenarioSelected} />
  {:else if stage === 2}
    <!-- story and plot -->
    <TabGroup>
      <Tab bind:group={storyTab} name="tab1" value={0}>Opening</Tab>
      <Tab bind:group={storyTab} name="tab2" value={1}>Story</Tab>
      <Tab bind:group={storyTab} name="tab4" value={2}>Game Settings</Tab>
      <Tab bind:group={storyTab} name="tab5" value={3}>LLM Settings</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if storyTab === 0}
        <Opening />
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
