import { dbGet, dbSet } from "$utilities/data/db";
import { writable, type Writable } from "svelte/store";

// Create the store instance
export const EnginePersonaStore: Writable<any> & {
  get: () => any;
  setAndPersist: () => Promise<void>;
} = createEnginePersonaStore();

// Define the custom store
// Define the custom store
function createEnginePersonaStore() {
  const { subscribe, set, update } = writable({
    persona: "Hamish",
    personaDesc:
      "%persona% is a 21 year old male tiger-humanoid that loves to expose himself to bank tellers.",
  });

  return {
    subscribe,
    set,
    update,
    get: async () => {
      try {
        const data = await dbGet({ db: "CRL", collection: "personas" });
        if (data) {
          set(data);
        }
        return data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
      }
    },
    setAndPersist: async () => {
      let currentValue: any;
      subscribe((value) => (currentValue = value))();
      set(currentValue);
      await dbSet({ db: "CRL", collection: "personas", data: currentValue });
    },
  };
}
