<script lang="ts">
  import { getToastStore, Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import Modal from "../ModalTemplate.svelte";
  import Scenarios from "./Settings/Scenarios.svelte";
  import Opening from "./Settings/Opening.svelte";
  import Story from "./Settings/Story.svelte";
  import GameSettings from "./Settings/GameSettings.svelte";
  import LlmSettings from "./Settings/LlmSettings.svelte";
  import {
    DungeonConversationStore,
    DungeonGameSettingsStore,
    resetDungeonSettingsStore,
  } from "$stores/dungeon";
  import { dbSet, dbUpdate } from "$utilities/db";
  export let stage: number;
  const ms = getToastStore();
  let loading = false;

  function forward() {
    stage = stage === 1 ? 2 : stage === 2 ? 3 : stage === 3 ? 0 : 1; //go forward
  }
  function backward() {
    console.log(`Backward${stage}`);
    stage = 1;
    console.log(`Changed${stage}`);
  }
  onMount(async () => {
    console.log("New Game");
    // Remove focus from any element to stop wanky default focuses on buttons.
    (document.activeElement as HTMLElement)?.blur();
    resetDungeonSettingsStore();
  });
  function scenarioSelected(event: CustomEvent) {
    console.log(event);
    if (!event.detail) return;
    $DungeonGameSettingsStore.game.genre = event.detail;
    forward();
  }
  let storyTab = 0;
  async function positiveClicked() {
    //basic check on essentials.
    if (
      //!$DungeonGameSettingsStore.game.genre ||
      !$DungeonGameSettingsStore.game.name ||
      //!$DungeonGameSettingsStore.game.description ||
      !$DungeonGameSettingsStore.game.opening ||
      !$DungeonGameSettingsStore.llmTextSettings.prompt
    ) {
      console.log("Missing essentials");
      ms.trigger({
        message: "Missing essentials. Re-check form",
        background: "variant-filled-primary",
        timeout: 2000,
        hideDismiss: true,
      });
      return;
    }
    //generate a unique id
    $DungeonGameSettingsStore.game.id = Math.random().toString(36).slice(2, 11);
    //add to database of games
    try {
      await dbUpdate("CRL", "dungeons", $DungeonGameSettingsStore.game.id, {
        name: $DungeonGameSettingsStore.game.name,
        desc: $DungeonGameSettingsStore.game.description ?? "",
        genre: $DungeonGameSettingsStore.game.genre,
        image: $DungeonGameSettingsStore.game.image ?? "",
        meta: { created: Date.now(), lastPlayed: Date.now() },
      });
      await DungeonGameSettingsStore.save();
      //Push opening into DungeonConversationStore
      DungeonConversationStore.set([{
        role: "assistant",
        content: $DungeonGameSettingsStore.game.opening,
        meta: { timestamp: Date.now(), hasAudio: false },
        type: "text",
      }]);
      //Push storySummary into DungeonConversationStore
      if ($DungeonGameSettingsStore.game.storySummary)
        $DungeonConversationStore.push({
          role: "assistant",
          content: $DungeonGameSettingsStore.game.storySummary,
          meta: { timestamp: Date.now(), hasAudio: false },
          type: "text",
        });
        DungeonConversationStore.save($DungeonGameSettingsStore.game.id);
    } catch (e) {
      console.error(e);
      ms.trigger({
        message: "Error creating game -- check console",
        background: "variant-filled-primary",
        timeout: 2000,
        hideDismiss: true,
      });
      return;
    }
    //build game folder and files
    //start game
  }
</script>

<Modal
  title="New Game"
  {stage}
  class="min-h-[82vh] max-h-[82vh] w-[60vh]"
  showFooterButtons={stage !== 1}
  on:back={backward}
  on:positiveClick={positiveClicked}
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
