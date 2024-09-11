import { writable, type Writable } from "svelte/store";

export const EngineLlmStore: Writable<any> = writable({
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
      //model: "gpt-4o-mini",
      stream: false,
      limitContext: 4096,
      memoryBank: true, //using vectera local
      historyTruncate: "middle", //can be 'start', 'middle'
      autoSummarise: 'main', //Can be false, local or main
      summariseAfter: 10, //automatically summarise after this many turns so it's really 20 messages
      convertToUkEnglish: false,
      generateNum: 100,
      defaultGenNum: 100,
      temperature: 0.7,
      topP: 0.90,
      topK: 50,
      presencePenalty: 0.5,
      frequencyPenalty: 1.5,
      seed: -1,
    },
    llm: {
      openai: {
        model: "gpt-4o-mini",
      },
      lmstudio: {
        baseUrl: "http://localhost:1234/v1",
        model: "lmstudio",
      },
    },
  });