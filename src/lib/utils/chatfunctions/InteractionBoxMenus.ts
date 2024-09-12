import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
import { DungeonManager } from "$stores/dungeon/DungeonManager";
import { get } from "svelte/store";

export async function restartGame(clearGallery = false) {
  //Get current game settings
  const gameSettings = get(DungeonGameSettingsStore);
  if (!gameSettings) return; //no
  if (!gameSettings?.game?.id) return; //no
  DungeonManager.reset(); //reset DungeonManager.
  await DungeonManager.save(gameSettings.game.id as string); //save DungeonManager.
  await DungeonConversationStore.restart(gameSettings.game.id as string); //reset and save DungeonConversationStore.
  //Clear gallery
  if(clearGallery) {
    //await DungeonGalleryStore.clear(gameSettings.game.id as string);
  }
}