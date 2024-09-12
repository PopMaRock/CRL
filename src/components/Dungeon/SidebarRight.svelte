<script lang="ts">
  import GameIconsSideswipe from "~icons/game-icons/sideswipe";
  import { logicalPropertiesHorizontalSlide } from "$lib/utils/transitions";
  import { onMount } from "svelte";
  import Button from "$components/Base/FormElements/button.svelte";
  import { getToastStore, Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { testLlmConnection } from "$utilities/utils";
  import Opening from "./Settings/Opening.svelte";
  import Story from "./Settings/Story.svelte";
  import GameSettings from "./Settings/GameSettings.svelte";
  import LlmSettings from "./Settings/LlmSettings.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { EngineLlmStore } from "$stores/engine/EngineLlm";
  //variable to manage open/close sidebar
  let srOpen = false;
  let srDiv: any;
  const toast = getToastStore();

  onMount(() => {
    const handleClickOutside = (event: any) => {
      if (srDiv && !srDiv.contains(event.target)) {
        srOpen = false;
        DungeonGameSettingsStore.save(); //set DungeonGameSettingsStore to database
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  });
  let settingsTab = 0;
</script>

<div
  bind:this={srDiv}
  class="bg-surface-50-900-token grid max-h-screen h-full grid-cols-[auto_1fr] overflow-hidden border-l border-surface-500/30 {$$props.class ??
    ''}"
>
  {#if srOpen}
    <section
      class="w-[60vh] space-y-4 overflow-y-auto p-4 pb-20"
      transition:logicalPropertiesHorizontalSlide={{
        direction: "inline",
        duration: 100,
      }}
    >
      <div class="mb-10 flex justify-between">
        <div id="open-close-btns" class="flex space-x-1">
          <button
            type="button"
            class="btn"
            title="Get the fuck back in"
            on:click={async (event) => {
              event.stopPropagation();
              await DungeonGameSettingsStore.save();
              srOpen = false;
            }}
            ><GameIconsSideswipe
              class="rotate-180 text-xl text-primary-900"
            /></button
          >
        </div>

        <div id="app-name">
          <div class="flex flex-col leading-none">
            <div class="text-xl">Game Settings</div>
          </div>
        </div>
      </div>

      <TabGroup>
        <Tab bind:group={settingsTab} name="tab1" value={0}>Connection</Tab>
        <Tab bind:group={settingsTab} name="tab1" value={1}>Opening</Tab>
        <Tab bind:group={settingsTab} name="tab2" value={2}>Story</Tab>
        <Tab bind:group={settingsTab} name="tab4" value={3}>Game Settings</Tab>
        <Tab bind:group={settingsTab} name="tab5" value={4}>LLM Settings</Tab>
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
          {#if settingsTab === 0}
            Provider:<select
              class="select rounded-md"
              bind:value={$DungeonGameSettingsStore.llmActive}
            >
              <option value="lmstudio">LMStudio (Local)</option>
              <option value="openai">OpenAI</option>
            </select>
            <div>
              {#if $EngineLlmStore.llm[$DungeonGameSettingsStore.llmActive].hasOwnProperty('baseUrl')}
                <div class="mb-2 mt-2">
                  <label for="LLMbaseUrl">LLM URL:</label>
                  
                  <input
                    type="text"
                    name="LLMbaseUrl"
                    class="input"
                    bind:value={$EngineLlmStore.llm[$DungeonGameSettingsStore.llmActive].baseUrl}
                  />
                </div>
              {/if}
              <div>
                <Button
                  class="variant-filled-primary btn"
                  on:click={async () =>
                    testLlmConnection(
                      $DungeonGameSettingsStore.llmActive,
                      toast,/*@ts-ignore*/
                      $EngineLlmStore.llm[$DungeonGameSettingsStore.llmActive]?.baseUrl
                    )}>Test Connection</Button
                >
              </div>
            </div>
          {:else if settingsTab === 1}
            <Opening />
          {:else if settingsTab === 2}
            <Story />
          {:else if settingsTab === 3}
            <GameSettings />
          {:else if settingsTab === 4}
            <LlmSettings />
          {/if}
        </svelte:fragment>
      </TabGroup>
    </section>
  {:else}
    <section>
      <button
        type="button"
        class="btn"
        on:click={(event) => {
          event.stopPropagation();
          srOpen = true;
        }}><GameIconsSideswipe class="text-xl text-primary-900" /></button
      >
    </section>
  {/if}
</div>
