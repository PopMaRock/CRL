import type { LayoutLoad } from "./$types";
import { get } from "svelte/store";
import { EngineLlmStore } from "$lib/stores/engine/EngineLlm";
import { EnginePersonaStore } from "$stores/engine/EnginePersona";
import { browser } from "$app/environment";

export const load = (async ({ fetch }) => {
  if(browser){
  let engineLlm = get(EngineLlmStore);
  console.log("Initial engineLlm from store:", engineLlm);

  if (!engineLlm || Object.keys(engineLlm).length === 0) {
    console.log("Fetching engineLlm settings from database...");
    engineLlm = await EngineLlmStore.get(fetch); // get the llm settings
    console.log("Fetched engineLlm from database:", engineLlm);
  }

  // Still nothing then set default
  if (!engineLlm || !Object.prototype.hasOwnProperty.call(engineLlm, "llmActive")) {
    console.log("No LLM settings found, setting default");
    EngineLlmStore.reset();
    engineLlm = get(EngineLlmStore);
    console.log("Default engineLlm set:", engineLlm);
  }

  let persona = await EnginePersonaStore.get(fetch);
  console.log("Fetched persona from database:", persona);

  if (!persona || Object.keys(persona).length === 0) {
    console.log("No persona found, setting default");
    await EnginePersonaStore.reset(); // Reset to default
    persona = get(EnginePersonaStore);
    console.log("Default persona set:", persona);
  }
}

  return {};
}) satisfies LayoutLoad;