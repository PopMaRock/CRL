import type { LayoutLoad } from "./gamemodes/dungeon/$types";
import { get } from "svelte/store";
import { EngineLlmStore } from "$lib/stores/engine/EngineLlm";
import { EnginePersonaStore } from "$stores/engine/EnginePersona";

export const load = (async ({ fetch }) => {
  let engineLlm = get(EngineLlmStore);
  if (!engineLlm) {
    engineLlm = await EngineLlmStore.get(fetch); // get the llm settings
  }
  //still nothing then set default
  if (!Object.prototype.hasOwnProperty.call(engineLlm, "llmActive")) {
    console.log("No LLM settings found, setting default");
    EngineLlmStore.reset();
  }
  const persona = get(EnginePersonaStore);
  console.log("persona", persona);
  if (!persona || Object.keys(persona).length === 0) {
    console.log("No persona found, setting default");
    await EnginePersonaStore.get(); // should get the data from the database
  }
  return {};
}) satisfies LayoutLoad;
