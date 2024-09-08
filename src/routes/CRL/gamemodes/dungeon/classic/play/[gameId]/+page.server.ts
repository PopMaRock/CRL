import {
  DungeonGameSettingsDefault,
} from "$stores/dungeon";
import type { PageServerLoad } from "./$types";
import { dbGet } from "$lib/utils/db";

export const load = (async ({ params, url }) => {
  const { gameId } = params;
  const baseUrl = url.origin;
  if (!baseUrl) throw new Error("No base URL found");
  if (gameId.includes(".") || !gameId) {
    return;
  }

  let dungeonGameSettings = await dbGet({
    db: `dungeons/${gameId}/gamesettings`,
    url: baseUrl,
  });
  let dungeonConversations = await dbGet({
    db: `dungeons/${gameId}/conversations`,
    url: baseUrl,
  });

  if (!dungeonGameSettings) {
    // Default settings if not found
    dungeonGameSettings = DungeonGameSettingsDefault;
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

  return {
    gameId,
    dungeonGameSettings,
    dungeonConversations,
  };
}) satisfies PageServerLoad;
