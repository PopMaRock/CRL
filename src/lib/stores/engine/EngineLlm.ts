import { dungeonPrompt } from "$lib/constants/prompts";
import { dbGet, dbSet, dbUpdate } from "$utilities/data/db";
import { get, writable, type Writable } from "svelte/store";

const EngineLlmDefault = {
  llmActive: "openai",
  llmTextSettings: {
    prompt: dungeonPrompt,
    model: "gpt-4o-mini",
    stream: false,
    limitContext: 4096,
    memoryBank: true, //using vectera local
    historyTruncate: "middle", //can be 'start', 'middle'
    autoSummarise: "main", //Can be false, local or main
    summariseAfter: 10, //automatically summarise after this many turns so it's really 20 messages
    convertToUkEnglish: false,
    generateNum: 100,
    defaultGenNum: 100,
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
    presencePenalty: 0.5,
    frequencyPenalty: 1.5,
    seed: -1,
  },
  llm: {
    openai: {},
    lmstudio: {
      baseUrl: "http://localhost:1234/v1",
    },
  },
};
const createEngineLlmStore = () => {
  const { subscribe, set, update } = writable({});

  return {
    subscribe,
    set,
    update,
    async save() {
      await dbSet({ db: "CRL", collection: "EngineLlm", data: get(this) });
    },
    async get(fetch?: Window["fetch"]) {
      const result = await dbGet({ db: "CRL", collection: "EngineLlm", fetch });
      if (!result || result?.error) return;
      this.set(result);
      return result;
    },
    reset() {
      this.set(EngineLlmDefault);
    },
  };
};

export const EngineLlmStore = createEngineLlmStore();
