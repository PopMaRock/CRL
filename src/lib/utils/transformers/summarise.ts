import type { DungeonConversation } from "$lib/types/game";
import { EngineProcessing } from "$stores/engine/EngineProcessing";
import { stripConversation } from "$utilities/apiHelper";

export async function summarise(
  autoSummarise: boolean | "local" | "main",
  llmActive: string,
  contextLimit: number,
  conversations: DungeonConversation[]
) {
  let text = "";
  for (let i = 0; i < conversations.length; i++) {
    text += `\n${conversations[i].content} `;
  }
  text = await stripConversation(text.trim(), contextLimit);
  if (autoSummarise === "local") {
    return await summariseLocal(text);
  }
  if (autoSummarise === "main") {
    return await summariseMain(text, llmActive);
  }
  return { error: "Invalid summarise type" };
}

async function summariseMain(text: string, llmActive: string) {
  if (!llmActive && !text) return { error: "Invalid summariseMain parameters" };
  try {
    EngineProcessing.update((state) => {
      state.llm = true;
      return state;
    });
    //prompt
    const prompt =
      "You are an AI dungeon master that summarizes any kind of roleplaying game content. The provided story history includes key plot points, world information, dialogue and character actions. Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.";
    const response = await fetch(`/api/llm/provider/${llmActive}/rawchat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "",
        systemPrompt: prompt,
        userMessage: `Story history: ${text}\r\n Distill the above story history into a single summary message. Respond in 250 words or less. Include as many specific details as you can. Only respond with the summary message.`,
        settings: {
          maxTokens: 400,
          temperature: 0.6,
          topP: 0.9,
          frequencyPenalty: 0.5,
          presencePenalty: 0.5,
          streaming: false,
        },
      }),
    });
    console.log("summary response", response);
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Return the result
    return data;
  } catch (error) {
    console.error("Error in summariseMain -> utils/summarise: ", error);
    return { error: "Internal Server Error" };
  } finally {
    EngineProcessing.update((state) => {
      state.llm = false;
      return state;
    });
  }
}
async function summariseLocal(text: string) {
  try {
    EngineProcessing.update((state) => {
      state.webLLM = true;
      return state;
    });
    const response = await fetch("/api/transformers/summarise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Return the result
    return data;
  } catch (error) {
    console.error("Error in summariseLocal -> utils/summarise: ", error);
    return { error: "Internal Server Error" };
  } finally {
    EngineProcessing.update((state) => {
      state.webLLM = false;
      return state;
    });
  }
}
