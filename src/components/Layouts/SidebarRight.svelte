<script lang="ts">
  import GameIconsSideswipe from "~icons/game-icons/sideswipe";
  import { logicalPropertiesHorizontalSlide } from "$lib/utils/transitions";
  import { fade } from "svelte/transition";
  import Button from "$components/Base/FormElements/button.svelte";
  import { testLlmConnection } from "$utilities/utils";
  import { EngineLlmStore } from "$stores/engine/EngineLlm";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  //variable to manage open/close sidebar

  async function saveSettings() {
    await EngineLlmStore.save();
  }
  const drawerStore = getDrawerStore();
</script>

<section
  class="w-[23rem] space-y-4 overflow-y-auto p-4 pb-20"
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
          await saveSettings();
          drawerStore.close();
        }}
        ><GameIconsSideswipe
          class="rotate-180 text-xl text-primary-900"
        /></button
      >
    </div>

    <div id="app-name">
      <div class="flex flex-col leading-none">
        <div class="text-xl">Engine Settings</div>
      </div>
    </div>
  </div>
  Provider:<select
    class="select rounded-md"
    bind:value={$EngineLlmStore.llmActive}
  >
    <option value="lmstudio">LMStudio (Local)</option>
    <option value="openai">OpenAI</option>
  </select>
  <div transition:fade>
    {#if $EngineLlmStore.llm[$EngineLlmStore.llmActive].hasOwnProperty("baseUrl")}
      <div class="mb-2 mt-2">
        <label for="LLMbaseUrl">LLM URL:</label>
        <input
          type="text"
          name="LLMbaseUrl"
          class="input"
          bind:value={$EngineLlmStore.llm[$EngineLlmStore.llmActive].baseUrl}
        />
      </div>
    {/if}
    <div>
      <Button
        class="variant-filled-primary btn"
        on:click={async () =>
          testLlmConnection(
            $EngineLlmStore.llmActive,
            $EngineLlmStore.llm[$EngineLlmStore.llmActive]?.baseUrl
          )}>Test Connection</Button
      >
    </div>
  </div>
</section>
