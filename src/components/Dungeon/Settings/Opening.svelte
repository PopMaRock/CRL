<script lang="ts">
  import { DungeonGameSettingsStore } from "$stores/dungeon";
  import { EngineLlmStore, EnginePersonaStore } from "$stores/engine";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import { WandSparkles } from "lucide-svelte";

  async function genPremise() {
    const response = await fetch("/api/llm/provider/openai/rawchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: $DungeonGameSettingsStore.llmTextSettings.model,
        systemPrompt: `
        Write a brief opening to a new role playing adventure which revolves around the user.

        User's name: ${$EnginePersonaStore.persona}
        User's description: ${$EnginePersonaStore.persona}
        Genre: ${$DungeonGameSettingsStore.game.genre}

        You should write in the second person i.e. "You are ${$EnginePersonaStore.persona} a...."`,
        settings: {
          baseUrl: $EngineLlmStore.llm.lmstudio.baseUrl, //FIXME: Fix this setting
          maxTokens: 100,
          temperature: 0.5,
          topP: 1,
          frequencyPenalty: 0.5,
          presencePenalty: 1.5,
          streaming: false,
        },
        //stop: ["###"],
      }),
    });
    const data = await response.json();
    console.log(data);
    $DungeonGameSettingsStore.game.opening = data.response;
  }
</script>

<div class="variant-filled-surface rounded-md mt-5 mb-5">
  <div class="flex items-center justify-between">
    <label for="opening" class="label pl-3 pt-3 font-semibold text-sm"
      >Opening</label
    >
    <button title="Generate opening" class="ml-4" on:click={genPremise}>
      <WandSparkles class="items-center mt-2 ml-4 mr-2 h-5 w-5" />
    </button>
  </div>
  <textarea
    name="premise"
    class="textarea-add min-h-40 w-full"
    bind:value={$DungeonGameSettingsStore.game.opening}
    placeholder="e.g. You find yourself in the rugged heartland of Alba. Life has been good and you are loved by the locals. However, a power-hungry queen plans to invade your country from the south. You must find a way to stop her armies and save your country."
  ></textarea>
</div>
<Accordion class="border-1 variant-filled-surface rounded-md mt-5 mb-5">
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
