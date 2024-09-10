import { dbSet } from "$utilities/data/db";
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
      if (!gameId || gameId.includes(".")) return;
      const conversations = get(this);

      await dbSet({
        db: `dungeons/${gameId}/conversations`,
        data: conversations,
      });
    },
  };
}
