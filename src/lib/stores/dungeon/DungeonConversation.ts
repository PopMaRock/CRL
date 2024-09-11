import type { DungeonConversation } from "$lib/types/game";
import { dbGet, dbSet } from "$utilities/data/db";
import { get, writable } from "svelte/store";

// Create the store instance
export const DungeonConversationStore = createDungeonConversationStore();
// Define the custom store with a save method
function createDungeonConversationStore() {
  const { subscribe, set, update } = writable<DungeonConversation[]>([]);

  return {
    subscribe,
    set,
    update,
    async save(gameId: string) {
      console.log("DungeonConversationStore save gameId:", gameId);
      if (!gameId || gameId.includes(".")) return;
      const conversations = get(this);

      await dbSet({
        db: `dungeons/${gameId}/conversations`,
        data: conversations,
      });
    },
    async get(gameId: string, fetch?: Window["fetch"]) {
      console.log("DungeonConversationStore get gameId:", gameId);
      if (!gameId || gameId.includes(".")) return;
      const result = await dbGet({
        db: `dungeons/${gameId}/conversations`, fetch
      });
      if (!result) {
        // Reset DungeonConversationStore
        this.set([]);
      } else {
        // Set DungeonConversationStore to the response
        this.set(result as DungeonConversation[]);
      }
    },
  };
}
