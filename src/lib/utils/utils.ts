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
import { browser } from "$app/environment";
import { getToastStore } from "@skeletonlabs/skeleton";

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
export async function testLlmConnection(llmActive: string, toast?:any, baseUrl?: string) {
  if (browser) {
    try {
      const response = await fetch(
        `/api/llm/provider/${llmActive}/ping?baseUrl=${baseUrl ?? ""}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to connect to LmStudio");
      }
      if(toast)toast.trigger({
        message: `Connection to ${llmActive} successful`,
        background: "variant-filled-success",
        timeout: 5000,
      });
    } catch (error) {
      console.error("Failed to connect to LLM.", error);
      if(toast)toast.trigger({
        message: `Connection to ${llmActive} failed: ${error}`,
        background: "variant-filled-error",
        timeout: 5000,
      });
    }
  }
}
/**
 * Formats a timestamp into a human-readable time ago format.
 *
 * @param timestamp - The timestamp to format, in milliseconds.
 * @returns The formatted time ago string.
 */
export function formatTimeAgo(timestamp: number, short = false) {
	const timeElapsedInSec = (new Date().getTime() - timestamp) / 1000;

	const secsPerMin = 60;
	const secsPerHour = secsPerMin * 60;
	const secsPerDay = secsPerHour * 24;
	const secsPerMonth = secsPerDay * 30;
	const secsPerYear = secsPerDay * 365;

	let value:number;
	let unit:string;

	if (timeElapsedInSec < secsPerMin) {
		value = Math.round(timeElapsedInSec);
		unit = short ? 's' : ' second';
	} else if (timeElapsedInSec < secsPerHour) {
		value = Math.floor(timeElapsedInSec / secsPerMin);
		unit = short ? 'm' : ' minute';
	} else if (timeElapsedInSec < secsPerDay) {
		value = Math.floor(timeElapsedInSec / secsPerHour);
		unit = short ? 'h' : ' hour';
	} else if (timeElapsedInSec < secsPerMonth) {
		value = Math.floor(timeElapsedInSec / secsPerDay);
		unit = short ? 'd' : ' day';
	} else if (timeElapsedInSec < secsPerYear) {
		value = Math.floor(timeElapsedInSec / secsPerMonth);
		unit = short ? 'mo' : ' month';
	} else {
		value = Math.floor(timeElapsedInSec / secsPerYear);
		unit = short ? 'y' : ' year';
	}

	if (!short && value !== 1) {
		unit += 's';
	}

	return `${value}${unit}`;
}
