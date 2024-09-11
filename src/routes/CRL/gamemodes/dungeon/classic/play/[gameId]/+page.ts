import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings.js";
import { DungeonManager } from "$stores/dungeon/DungeonManager";
import { tick } from "svelte";
export const ssr = false; //da run on the server. Just browser.

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, fetch }) {
  console.error("Dungeon Classic Play Page");
  const { gameId } = params;
  const baseUrl = url.origin;
  if (!baseUrl) throw new Error("No base URL found");
  if (gameId.includes(".") || !gameId) {
    return;
  }
  //REALLY! SHOULD RESET ALL THE STORES FIRST!
  //reset everything
  DungeonGameSettingsStore.reset();
  DungeonConversationStore.set([]);
  DungeonManager.reset();
  //set everything
  await tick();
  await DungeonGameSettingsStore.get(gameId, fetch); //get the game settings
  await DungeonConversationStore.get(gameId, fetch); //get the conversations
  await DungeonManager.get(gameId, fetch); //get the game manager

  return {
    gameId,
  };
}
