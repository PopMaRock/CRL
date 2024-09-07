import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//-------------
// biome-ignore lint/style/useNamingConvention: <OpenAI are stuck in their python ways>
import cl100k_base from "tiktoken/encoders/cl100k_base";
import { Tiktoken } from "tiktoken";
import { addProcessToQueue } from "$stores/processes";
import { get, type Writable } from "svelte/store";
import { EngineLlmStore } from "$stores/engine";
import { DungeonGameSettingsStore } from "$stores/dungeon";

export async function getTokens(text: string): Promise<any> {
  if (!text) return undefined;

  const processFn = async () => {
    const encoding = new Tiktoken(
      cl100k_base.bpe_ranks,
      cl100k_base.special_tokens,
      cl100k_base.pat_str
    );
    const tokens = encoding.encode(text);
    encoding.free();
    return tokens;
  };

  return addProcessToQueue("getTokens", "Tokenize", processFn);
}
//Probably doesn't belong here...
export async function crlGenerate(
  weAre: "engine" | "game",
  prompt: string,
  maxTokens?: number,
  temperature?: number,
  topP?: number,
  frequencyPenalty?: number,
  presencePenalty?: number,
  streaming?: boolean,
  stop: string[] = []
): Promise<any> {
  let mStore: any;
  if (weAre === "engine") mStore = get(EngineLlmStore);
  else mStore = get(DungeonGameSettingsStore);
  const response = await fetch(
    `/api/llm/provider/${mStore.llmActive}/rawchat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: mStore.llmTextSettings.model,
        systemPrompt: prompt,
        settings: {
          baseUrl:
            mStore.llmActive === "lmstudio"
              ? get(EngineLlmStore).llm.lmstudio.baseUrl
              : "",
          maxTokens: maxTokens ?? mStore.llmTextSettings.genTokens ?? 300,
          temperature: temperature ?? mStore.llmTextSettings.temperature ?? 0.7,
          topP: topP ?? mStore.llmTextSettings.topP ?? 1,
          frequencyPenalty:
            frequencyPenalty ?? mStore.llmTextSettings.frequencyPenalty ?? 0.5,
          presencePenalty:
            presencePenalty ?? mStore.llmTextSettings.presencePenalty ?? 1.5,
          streaming: streaming ?? mStore.llmTextSettings.streaming ?? false,
        },
        stop: stop ?? [],
      }),
    }
  );
  const data = await response.json();
  console.log(data);
  return data.response;
}
