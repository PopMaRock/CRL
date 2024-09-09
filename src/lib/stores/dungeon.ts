import { get, writable, type Writable } from "svelte/store";
import { EngineLlmStore } from "./engine";
import { dbSet } from "$utilities/db";

//TODO: TIDY THIS FUCKIN MESS UP

//DungeonGameSettings
export const DungeonGameSettingsDefault: DungeonGameSettings = {
  llmActive: "openai",
  llmTextSettings: {
    prompt: `You are an AI dungeon master that provides any kind of roleplaying game content.

Instructions:
- Be specific, descriptive, and creative.
- Avoid repetition and avoid summarization.
- Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.
- Never decide or write for the user. If the input ends mid sentence, continue where it left off. ">" tokens mean a character action attempt. You should describe what happens when the player attempts that action.
- Make sure you always give responses continuing mid sentence even if it stops partway through.

%personaName%
%personaDesc%

%opening%
%plotEssentials%
%authorsNotes%
%storySummary%
%recent%`,
    model: "gpt4o-mini",
    stream: false,
    limitContext: 4096,
    memoryBank: true, //using vectera local
    historyTruncate: "middle", //can be 'start', 'middle'
    autoSummarize: false, //Can be false, local or main
    convertToUkEnglish: false,
    generateNum: 100, //internal
    defaultGenNum: 100,
    temperature: 0.7,
    topP: 0.95,
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

export const DungeonGameStateStore: Writable<any> = writable({
  lootBox: [],
  placeAndTime: {},
  shop: [],
  choices: [],
  enemy: {},
  event: { inCombat: false, shopMode: null, lootMode: false },
  meta: {
    created: Date.now(),
    lastPlay: Date.now(),
  },
});
// Define the custom store with a save method
function createDungeonConversationStore() {
  const { subscribe, set, update } = writable<DungeonConversation[]>([]);

  return {
    subscribe,
    set,
    update,
    async save(gameId: string) {
      if(!gameId || gameId.includes(".")) return;
      const conversations = get(this);

      await dbSet({
        db: `dungeons/${gameId}/conversations`,
        data: conversations,
      });
    },
  };
}

// Create the store instance
export const DungeonConversationStore = createDungeonConversationStore();
export const DungeonGameSettingsStore: Writable<DungeonGameSettings> & {
  reset: () => void;
} & { save: () => Promise<void> } = createDungeonGameSettingsStore(); //fuck knows why it needs to be done this way...
export const DungeonPlayerStore: Writable<DungeonPlayer> = writable();
export const DungeonCharacterStore: Writable<any> = writable({
  characters: [],
});
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
  };
}

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
//defaults:

//DungeonGameState
export const DungeonGameStateDefault: DungeonGameState = {
  lootBox: [],
  placeAndTime: {},
  shop: [],
  choices: [],
  enemy: {},
  gameEvent: { inCombat: false, shopMode: null, lootMode: false },
  meta: {
    created: Date.now(),
    lastPlay: Date.now(),
  },
};
//DungeonPlayer
export const DungeonPlayerDefault: DungeonPlayer = {
  name: "",
  gender: "",
  visual: "",
  background: "",
  class: "",
  level: 1,
  xp: 0,
  nextLevel: 100,
  stats: [{ hp: 0, maxHp: 0, mp: 0, maxMp: 0 }],
  gold: 0,
  spells: [],
  inventory: [],
};
