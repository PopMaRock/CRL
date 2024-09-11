import { dbGet, dbSet } from "$utilities/data/db";
import { writable, type Writable } from "svelte/store";

const EnginePersonaDefault = {
    persona: "Hamish",
    personaDesc:
      "%persona% is a 21 year old male tiger-humanoid that loves to expose himself to bank tellers.",
}
// Create the store instance
export const EnginePersonaStore: Writable<any> & {
  get: () => any;
  setAndPersist: () => Promise<void>;
} = createEnginePersonaStore();

// Define the persona store
function createEnginePersonaStore() {
  const { subscribe, set, update } = writable({});

  return {
    subscribe,
    set,
    update,
    get: async (fetch?:Window["fetch"]) => {
      try {
        const data = await dbGet({ db: "CRL", collection: "personas", fetch });
        if (data) {
          console.log("Got persona data and setting it as:", data);
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
