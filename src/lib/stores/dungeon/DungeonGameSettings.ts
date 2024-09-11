import type { DungeonGameSettings } from "$lib/types/game";
import { EngineLlmStore } from "$stores/engine/EngineLlm";
import { dbGet, dbSet } from "$utilities/data/db";
import { get, writable, type Writable } from "svelte/store";

const DungeonGameSettingsDefault: DungeonGameSettings = {
  llmActive: "openai",
  llmTextSettings: {
    prompt: `You are an AI dungeon master that provides any kind of roleplaying game content.
  
  Instructions:
  - Be specific, descriptive, and creative.
  - Avoid repetition and avoid summarization.
  - Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.
  - Never decide or write for the user. If the input ends mid sentence, continue where it left off. ">" tokens mean a character action attempt. You should describe what happens when the player attempts that action.
  
  %personaName%
  %personaDesc%
  
  %opening%
  %plotEssentials%
  %authorsNotes%
  %storySummary%
  %recent%`,
    model: "gpt-4o-mini",
    stream: false,
    limitContext: 4096,
    memoryBank: true, //using vectera local
    historyTruncate: "middle", //can be 'start', 'middle'
    autoSummarise: "main", //Can be false, local or main
    summariseAfter: 10, //automatically summarise after this many turns so it's really 20 messages
    convertToUkEnglish: false,
    generateNum: 100, //internal
    defaultGenNum: 100,
    temperature: 0.7,
    topP: 0.90,
    topK: 50,
    presencePenalty: 0.5,
    frequencyPenalty: 1.5,
    seed: -1, //internal
  },
  game: {
    id: null,
    name: "",
    description: "",
    createdBy: "CRL",
    genre: "",
    image: "",
    opening: "",
    plotEssentials: "",
    authorsNotes: "",
    storySummary: "",
    sd: false,
    vo: false,
  },
  sd: {
    sdActive: "webui",
    sdDefaultPositive: "(masterpiece), drawing",
    sdDefaultNegative: "(bad hands), realistic",
  },
  vo: {
    voActive: "elevenlabs",
    voDefaultPositive: "happy",
    voDefaultNegative: "sad",
    model: "Alice",
  },
  accessability: {
    fadein: true,
    text: "normal", //can be print, clean, hacker
  },
  behaviour: {
    autoSave: true,
    autoSaveInterval: 60000,
  },
};
//DungeonGameSettings
function createDungeonGameSettingsStore() {
  const { subscribe, set, update } = writable<DungeonGameSettings>(
    DungeonGameSettingsDefault
  );

  return {
    subscribe,
    set,
    update,
    reset: () => set(structuredClone(DungeonGameSettingsDefault)),
    save: async () => {
      const tempDungeon = get(DungeonGameSettingsStore);
      await dbSet({
        db: `dungeons/${tempDungeon.game.id}/gamesettings`,
        data: tempDungeon,
      });
    },
    async get(gameId: string, fetch?: Window["fetch"]) {
      if (!gameId || gameId.includes(".")) return;
      const result = await dbGet({
        db: `dungeons/${gameId}/gamesettings`,
      });
      if (!result) {
        // Reset DungeonGameSettingsStore
        this.reset();
      } else {
        // Set DungeonGameSettingsStore to the response
        this.set(result);
      }
    }
  };
}
export const DungeonGameSettingsStore = createDungeonGameSettingsStore(); //fuck knows why it needs to be done this way...
export function resetDungeonSettingsStore() {
  // Clear the DungeonGameSettingsStore
  DungeonGameSettingsStore.reset();
  const mEngine = get(EngineLlmStore);
  // Merge in user defaults from EngineLlmStore
  DungeonGameSettingsStore.update((s) => {
    return {
      ...s,
      llmTextSettings: {
        ...s.llmTextSettings,
        llmActive: mEngine.llmActive,
        ...mEngine.llmTextSettings,
      },
    };
  });
}
