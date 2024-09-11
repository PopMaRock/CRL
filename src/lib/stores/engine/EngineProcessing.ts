import { writable, type Writable } from "svelte/store";

export const EngineProcessing: Writable<any> = writable({
    llm: false,
    webLLM: false,
    sd: false,
    vo: false,
    db: false,
})