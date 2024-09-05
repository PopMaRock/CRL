import { cutTrailingSentence, firstToSecondPerson } from "../story/utils";
import { get } from "svelte/store";
import { getSimilarity } from "$utilities/similarity";
import {
  DungeonConversationStore,
  DungeonGameSettingsStore,
} from "$stores/dungeon";
import { EngineLlmStore } from "$stores/engine";

export class Generator {
  expandPath(path: string): string {
    return path.replace("~", process.env.HOME || "");
  }

  promptReplace(prompt: string): string {
    return prompt
      .replace("#", "")
      .replace("*", "")
      .replace("\n\n", "\n")
      .replace(/(?<=\w)\.\.(?:\s|$)/g, ".")
      .trimEnd();
  }

  resultReplace(result: string): string {
    return cutTrailingSentence(
      result
        .replace('."', '".')
        .replace("#", "")
        .replace("*", "")
        .replace("\n\n", "\n")
        .replace("(?<=\\w)\\.\\.(?:\\s|$)", ".")
        .replace(/#{1,3} Response:/, "")
    ).trimEnd();
  }

  cutDownPrompt(prompt: string): string {
    const splitPrompt = prompt.split(">");
    const expendableText = splitPrompt.slice(2).join(">");
    return splitPrompt[0] + (expendableText ? `>${expendableText}` : "");
  }

  private async genOutput(response: any, history: any): Promise<void> {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    const DGSS = get(DungeonGameSettingsStore);
    const settings = {
      systemPrompt: DGSS.llmTextSettings.prompt,
      history: history,
      model: DGSS.llmTextSettings.model,
      settings: {
        stream: DGSS.llmTextSettings.stream ?? false,
        baseUrl: get(EngineLlmStore).llm[DGSS.llmActive].baseUrl,
        temperature: DGSS.llmTextSettings.temperature,
        topP: DGSS.llmTextSettings.topP,
        topK: DGSS.llmTextSettings.topK,
        generateNum: DGSS.llmTextSettings.generateNum,
        presencePenalty: DGSS.llmTextSettings.presencePenalty,
        frequencyPenalty: DGSS.llmTextSettings.frequencyPenalty,
        seed: DGSS.llmTextSettings.seed,
      },
    };
    console.log("Request to LLM: ", settings);
    try {
      const answer = await response.request(
        new Request(`/api/llm/${DGSS.llmActive}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        })
      );
      if (!answer) throw new Error("No response from LLM");
      const assistantMessage: DungeonConversation = {
        role: "assistant",
        content: this.resultReplace(answer as string),
        meta: { timestamp: Date.now(), hasAudio: false },
        type: "text",
      };
      //@ts-ignore
      DungeonConversationStore.update((conversations) => [
        ...conversations,
        assistantMessage,
      ]);
    } catch (error: any) {
      console.log("Error in genOutput: ", error);
      return error;
    }
  }
  public async handleMessage(
    response: any,
    message: string,
    actionOption: string
  ): Promise<void> {
    let m = message.trim();
    m = m[0].toLowerCase() + m.slice(1);
    if (![".", "?", "!"].includes(m.slice(-1))) {
      m += ".";
    }
    if (actionOption !== "say") m = firstToSecondPerson(m);

    m =
      actionOption === "do"
        ? `>You ${m}`
        : actionOption === "say"
        ? `You say "${m}"`
        : message;

    if (["say", "ask", '"'].some((substring) => m.includes(substring))) {
      // Update the store value to increase the token value by 50%
      DungeonGameSettingsStore.update((store) => {
        store.llmTextSettings.generateNum = store.llmTextSettings.defaultGenNum * 1.5;
        return store;
      });
    } else {
      // Update the store value to the default token value
      DungeonGameSettingsStore.update((store) => {
        store.llmTextSettings.generateNum = store.llmTextSettings.defaultGenNum;
        return store;
      });
    }

    m = this.promptReplace(m);
    const lastPrompt = m.includes(">") ? m.split(">").pop() : m;
    //If it's a continue, don't add the user message to the conversation
    console.log("Action option in Generator: ", actionOption);
    if (actionOption !== "continue") {
      console.log("Adding message to conversation");
      //@ts-ignore
      DungeonConversationStore.update((conversations) => [
        ...conversations,
        {
          role: actionOption === "story" ? "assistant" : "user",
          content: m, //message
          meta: { timestamp: Date.now(), hasAudio: false },
          type: "text",
        },
      ]);
    }
    //Build the history as LLM will only accept [{role: '', content: ''}] format
    const history = get(DungeonConversationStore).map((conversation) => {
      return { role: conversation.role, content: conversation.content };
    });
    try {
      await this.genOutput(response, history); //do generation
    } catch (error) {
      console.log("Error in handleMessage: ", error);
    }

    const tempStory: any = get(DungeonConversationStore);
    if (tempStory.length >= 2) {
      const similarity = getSimilarity(
        tempStory[tempStory.length - 1].content,
        tempStory[tempStory.length - 2].content
      );
      if (similarity > 0.9) {
        tempStory.pop();
      }
    }
    //feed tempStory back into AIDConversation
    //@ts-ignore
    DungeonConversationStore.set(tempStory);
  }
}
