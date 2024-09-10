import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings.js";
import { dbGet } from "$utilities/data/db";
export const ssr = false; //da run on the server. Just browser.

/** @type {import('./$types').PageLoad} */
export async function load({ params, url, fetch }) {
  const { gameId } = params;
  const baseUrl = url.origin;
  if (!baseUrl) throw new Error("No base URL found");
  if (gameId.includes(".") || !gameId) {
    return;
  }

  let dungeonGameSettings = await dbGet({
    db: `dungeons/${gameId}/gamesettings`,
    url: baseUrl,
    fetch,
  });
  let dungeonConversations = await dbGet({
    db: `dungeons/${gameId}/conversations`,
    url: baseUrl,
    fetch,
  });

  if (!dungeonGameSettings) {
    // Default settings if not found
    await DungeonGameSettingsStore.reset();
  }

  if (!dungeonConversations) {
    dungeonConversations = [
      {
        role: "assistant",
        content:
          "Once upon a time, in a land far, far away. Someone deleted the database for this game session, and now I have no idea where the fuck to begin.",
      },
    ];
  }
  //set stores
  DungeonGameSettingsStore.set(dungeonGameSettings);
  DungeonConversationStore.set(dungeonConversations);

  return {
    gameId,
  };
}
