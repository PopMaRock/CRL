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
import { get } from "svelte/store";
import { browser } from "$app/environment";
import { EngineLlmStore } from "$stores/engine/EngineLlm";
import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";

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
  if (data.error) {
    throw new Error(data.error);
  }
  return data.response;
}
export async function testLlmConnection(
  llmActive: string,
  toast?: any,
  baseUrl?: string
) {
  if (browser) {
    try {
      const response = await fetch(
        `/api/llm/provider/${llmActive}/ping?baseUrl=${baseUrl ?? ""}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to connect to LmStudio");
      }
      if (toast)
        toast.trigger({
          message: `Connection to ${llmActive} successful`,
          background: "variant-filled-success",
          timeout: 5000,
        });
    } catch (error) {
      console.error("Failed to connect to LLM.", error);
      if (toast)
        toast.trigger({
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

  let value: number;
  let unit: string;

  if (timeElapsedInSec < secsPerMin) {
    value = Math.round(timeElapsedInSec);
    unit = short ? "s" : " second";
  } else if (timeElapsedInSec < secsPerHour) {
    value = Math.floor(timeElapsedInSec / secsPerMin);
    unit = short ? "m" : " minute";
  } else if (timeElapsedInSec < secsPerDay) {
    value = Math.floor(timeElapsedInSec / secsPerHour);
    unit = short ? "h" : " hour";
  } else if (timeElapsedInSec < secsPerMonth) {
    value = Math.floor(timeElapsedInSec / secsPerDay);
    unit = short ? "d" : " day";
  } else if (timeElapsedInSec < secsPerYear) {
    value = Math.floor(timeElapsedInSec / secsPerMonth);
    unit = short ? "mo" : " month";
  } else {
    value = Math.floor(timeElapsedInSec / secsPerYear);
    unit = short ? "y" : " year";
  }

  if (!short && value !== 1) {
    unit += "s";
  }

  return `${value}${unit}`;
}

export function formatResult(text: string): string {
  return text
    .replace(/\n{3,}/g, "<br>")
    .replace(/ {2,}/g, " ")
    .replace(/\n/g, " ")
    .replace(/<br>/g, "\n")
    .replace(/("[.!?]) ([A-Z])/g, "$1\n\n$2")
    .replace(/([^"][.!?]) "/g, '$1\n\n"')
    .replace(/([".!?]) "/g, '$1\n"')
    .trim();
}

export function endSentence(text: string): string {
  if (!text.endsWith(".") && !text.endsWith("?") && !text.endsWith("!")) {
    return `${text}.`;
  }
  return text;
}
export function fillText(text: string, width: number): string {
  const texts = text.split("\n");
  for (let i = 0; i < texts.length; i++) {
    texts[i] = wrapText(texts[i], width);
  }
  return texts.join("\n");
}

function wrapText(text: string, width: number): string {
  let result = "";
  let lineLength = 0;

  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (lineLength + word.length > width) {
      result += "\n";
      lineLength = 0;
    }
    result += `${word} `;
    lineLength += word.length + 1;
  }

  return result.trim();
}
export function playerDied(text: string): boolean {
  /**
   * TODO: Add in more sophisticated NLP, maybe a custom classifier
   * trained on hand-labelled data that classifies second-person
   * statements as resulting in death or not.
   */
  const lowerText = text.toLowerCase();
  const youDeadRegexps = [
    "you('re| are) (dead|killed|slain|no more|nonexistent)",
    "you (die|pass away|perish|suffocate|drown|bleed out)",
    "you('ve| have) (died|perished|suffocated|drowned|been (killed|slain))",
    "you (\\w* )?(yourself )?to death",
    "you (\\w* )*(collapse|bleed out|chok(e|ed|ing)|drown|dissolve) (\\w* )*and (die(|d)|pass away|cease to exist|(\\w* )+killed)",
  ];

  return youDeadRegexps.some((regexp) => new RegExp(regexp).test(lowerText));
}
export function playerWon(text: string): boolean {
  const lowerText = text.toLowerCase();
  const wonPhrases = [
    "you ((\\w* )*and |)live happily ever after",
    "you ((\\w* )*and |)live (forever|eternally|for eternity)",
    "you ((\\w* )*and |)(are|become|turn into) ((a|now) )?(deity|god|immortal)",
    "you ((\\w* )*and |)((go|get) (in)?to|arrive (at|in)) (heaven|paradise)",
    "you ((\\w* )*and |)celebrate your (victory|triumph)",
    "you ((\\w* )*and |)retire",
  ];

  return wonPhrases.some((regexp) => new RegExp(regexp).test(lowerText));
}

/**
 * Removes the last quote from a string if the number of quotes is odd.
 *
 * @param text - The input string.
 * @returns The modified string with the last quote removed, or the original string if the number of quotes is even.
 */
export function cutTrailingQuotes(text: string): string {
  // Count the number of quotes in the string.
  const numQuotes = text.split('"').length - 1;

  // If the number of quotes is even, return the original string.
  if (numQuotes % 2 === 0) {
    return text;
  }
  // If the number of quotes is odd, find the last quote and return the string up to that point.
  const finalInd = text.lastIndexOf('"');
  return text.substring(0, finalInd);
}
/**
 * Adds a trailing quote to the text if the number of quotes is odd.
 *
 * @param text - The input string.
 * @returns The modified string with an added trailing quote if the number of quotes is odd, or the original string if the number of quotes is even.
 */
export function fixTrailingQuotes(text: string): string {
  // Count the number of quotes in the string.
  const numQuotes = text.split('"').length - 1;

  // If the number of quotes is even, return the original string.
  if (numQuotes % 2 === 0) {
    return text;
  }
  // If the number of quotes is odd, add a trailing quote.
  return `${text}"`;
}
/**
 * Splits the input text into two parts: the first sentence and the rest of the text.
 *
 * @param text - The input string.
 * @returns A tuple where the first element is the first sentence and the second element is the rest of the text.
 */
export function splitFirstSentence(text: string): [string, string] {
  const firstPeriod = text.indexOf(".");
  const firstExclamation = text.indexOf("!");

  let splitPoint: number;

  if (firstExclamation < firstPeriod && firstExclamation > 0) {
    splitPoint = firstExclamation + 1;
  } else if (firstPeriod > 0) {
    splitPoint = firstPeriod + 1;
  } else {
    splitPoint = 20;
  }

  return [text.substring(0, splitPoint), text.substring(splitPoint)];
}
/**
 * Removes the last line from the text if it contains certain phrases and there is more than one line.
 *
 * @param text - The input string.
 * @returns The modified string with the last line removed if it contains certain phrases, or the original string otherwise.
 */
export function cutTrailingAction(text: string): string {
  const lines = text.trim().split("\n");
  const lastPara = lines[lines.length - 1].match(/.+?(?:\.{1,3}|[!?]|$)(?!")/g);

  if (!lastPara || lastPara.length < 1) {
    return "";
  }

  const lastLine = lastPara[lastPara.length - 1].trim();

  if (
    (lastLine.toLowerCase().includes("you ask") ||
      lastLine.toLowerCase().includes("you say")) &&
    lines.length > 1
  ) {
    if (lastPara.length > 1) {
      lastPara.pop();
      lines[lines.length - 1] = lastPara.join(" ");
    } else {
      lines.pop();
    }
  }

  return lines.join("\n");
}
/**
 * Removes the trailing sentence from the text based on punctuation and certain tokens.
 *
 * @param text - The input string.
 * @returns The modified string with the trailing sentence removed.
 */
export function cutTrailingSentence(text: string): string {
  let t = standardizePunctuation(text);
  let lastPunc = Math.max(
    t.lastIndexOf(","),
    t.lastIndexOf("."),
    t.lastIndexOf("!"),
    t.lastIndexOf("?")
  );

  if (lastPunc <= 0) {
    lastPunc = t.length - 1;
  }

  /*const etToken = t.indexOf("<");
  if (etToken > 0) {
    lastPunc = Math.min(lastPunc, etToken - 1);
  } else if (etToken === 0) {
    lastPunc = Math.min(lastPunc, etToken);
  }

  const actToken = t.indexOf(">");
  if (actToken > 0) {
    lastPunc = Math.min(lastPunc, actToken - 1);
  } else if (actToken === 0) {
    lastPunc = Math.min(lastPunc, actToken);
  }*/

  t = t.substring(0, lastPunc + 1);

  t = fixTrailingQuotes(t);
    // Ensure the sentence does not end with a comma and replace it with a full stop if necessary
    if (t.endsWith(",") || (!t.endsWith("!") && !t.endsWith("?"))) {
      t = `${t.slice(0, -1)}.`;
    }
  //t = cutTrailingAction(t);
  return t;
}
/**
 * Replaces occurrences of a word outside of quotes with another word.
 *
 * @param text - The input string.
 * @param currentWord - The word to be replaced.
 * @param replWord - The word to replace with.
 * @returns The modified string with the word replaced.
 */
export function replaceOutsideQuotes(
  text: string,
  currentWord: string,
  replWord: string
): string {
  return standardizePunctuation(text).replace(new RegExp(`${currentWord}(?=([^"]*"[^"]*")*[^"]*$)`, "g"), replWord);
}

/**
 * Checks if the text is written in the first person.
 *
 * @param text - The input string.
 * @returns True if the text is in the first person, otherwise false.
 */
export function isFirstPerson(text: string): boolean {
  let count = 0;
  for (const pair of firstToSecondMappings) {
    const variations = mappingVariationPairs(pair);
    for (const variation of variations) {
      const regExpr = new RegExp(
        `${variation[0]}(?=([^"]*"[^"]*")*[^"]*$)`,
        "g"
      );
      const matches = text.match(regExpr);
      if (matches) {
        count += matches.length;
      }
    }
  }

  return count > 3;
}

/**
 * Checks if the text is written in the second person.
 *
 * @param text - The input string.
 * @returns True if the text is in the second person, otherwise false.
 */
export function isSecondPerson(text: string): boolean {
  let count = 0;
  for (const pair of secondToFirstMappings) {
    const variations = mappingVariationPairs(pair);
    for (const variation of variations) {
      const regExpr = new RegExp(
        `${variation[0]}(?=([^"]*"[^"]*")*[^"]*$)`,
        "g"
      );
      const matches = text.match(regExpr);
      if (matches) {
        count += matches.length;
      }
    }
  }

  return count > 3;
}

/**
 * Capitalizes the first letter of a word.
 *
 * @param word - The input word.
 * @returns The word with the first letter capitalized.
 */
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Generates variations of a mapping pair for text replacement.
 *
 * @param mapping - The input mapping pair.
 * @returns An array of mapping variations.
 */
export function mappingVariationPairs(
  mapping: [string, string]
): [string, string][] {
  const mappingList: [string, string][] = [];
  mappingList.push([` ${mapping[0]} `, ` ${mapping[1]} `]);
  mappingList.push([
    ` ${capitalize(mapping[0])} `,
    ` ${capitalize(mapping[1])} `,
  ]);

  if (mapping[0] === "you") {
    mapping.splice(0, mapping.length, "you", "me");
  }
  mappingList.push([` ${mapping[0]},`, ` ${mapping[1]},`]);
  mappingList.push([` ${mapping[0]}\\?`, ` ${mapping[1]}\\?`]);
  mappingList.push([` ${mapping[0]}\\!`, ` ${mapping[1]}\\!`]);
  mappingList.push([` ${mapping[0]}\\.`, ` ${mapping[1]}.`]);

  return mappingList;
}

/**
 * Capitalizes the first letter of each sentence in the text.
 *
 * @param text - The input string.
 * @returns The modified string with capitalized first letters.
 */
export function capitalizeFirstLetters(text: string): string {
  const firstLettersRegex = /((?<=[\.\?!]\s)(\w+)|(^\w+))/g;

  return text.replace(firstLettersRegex, (match) => capitalize(match));
}

/**
 * Standardizes punctuation in the text.
 *
 * @param text - The input string.
 * @returns The modified string with standardized punctuation.
 */
export function standardizePunctuation(text: string): string {
  return text
    .replace(/’/g, "'")
    .replace(/`/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"');
}

/**
 * Converts first person text to second person.
 *
 * @param text - The input string.
 * @returns The modified string in second person.
 */
export function firstToSecondPerson(text: string): string {
  let t = ` ${text}`;
  t = standardizePunctuation(t);
  for (const pair of firstToSecondMappings) {
    const variations = mappingVariationPairs(pair);
    for (const variation of variations) {
      t = replaceOutsideQuotes(t, variation[0], variation[1]);
    }
  }

  return capitalizeFirstLetters(t.trim());
}

/**
 * Converts second person text to first person.
 *
 * @param text - The input string.
 * @returns The modified string in first person.
 */
export function secondToFirstPerson(text: string): string {
  let t = ` ${text}`;
  t = standardizePunctuation(t);
  for (const pair of secondToFirstMappings) {
    const variations = mappingVariationPairs(pair);
    for (const variation of variations) {
      t = replaceOutsideQuotes(t, variation[0], variation[1]);
    }
  }

  return capitalizeFirstLetters(t.trim());
}

// Mappings for first to second person conversion
const firstToSecondMappings: [string, string][] = [
  ["I'm", "you're"],
  ["Im", "you're"],
  ["Ive", "you've"],
  ["I am", "you are"],
  ["was I", "were you"],
  ["am I", "are you"],
  ["wasn't I", "weren't you"],
  ["I", "you"],
  ["I'd", "you'd"],
  ["i", "you"],
  ["I've", "you've"],
  ["I was", "you were"],
  ["my", "your"],
  ["we", "you"],
  ["we're", "you're"],
  ["mine", "yours"],
  ["me", "you"],
  ["us", "you"],
  ["our", "your"],
  ["I'll", "you'll"],
  ["myself", "yourself"],
];

// Mappings for second to first person conversion
const secondToFirstMappings: [string, string][] = [
  ["you're", "I'm"],
  ["your", "my"],
  ["you are", "I am"],
  ["you were", "I was"],
  ["are you", "am I"],
  ["you", "I"],
  ["you", "me"],
  ["you'll", "I'll"],
  ["yourself", "myself"],
  ["you've", "I've"],
];

