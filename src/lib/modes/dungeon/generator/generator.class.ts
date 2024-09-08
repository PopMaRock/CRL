import { cutTrailingSentence, firstToSecondPerson } from "../story/utils";
import { get } from "svelte/store";
import { getSimilarity } from "$utilities/similarity";
import {
  DungeonConversationStore,
  DungeonGameSettingsStore,
} from "$stores/dungeon";
import { EngineLlmStore, EnginePersonaStore } from "$stores/engine";
import { browser } from "$app/environment";

export class Generator {
  expandPath(path: string): string {
    return path.replace("~", process.env.HOME || "");
  }

  promptReplace(prompt: string): string {
    return prompt
      .replace("\n\n", "\n")
      .replace(/(?<=\w)\.\.(?:\s|$)/g, ".")
      .trimEnd();
  }

  resultReplace(result: string): string {
    //Command R has this habit of responding with > at the start of the response remove it
    let resp = result;
    //remove <EOS_TOKEN>
    //strip/replace HTML
    return cutTrailingSentence(
      resp
        .replace(/&nbsp;/g, " ")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&cent;/g, "¢")
        .replace(/&pound;/g, "£")
        .replace(/&yen;/g, "¥")
        .replace(/&euro;/g, "€")
        .replace(/&copy;/g, "")
        .replace(/&reg;/g, "")
        .replace(/&trade;/g, "")
        .replace(/&times;/g, "x")
        .replace(/&divide;/g, "/")
        .replace(/&ndash;/g, "-")
        .replace(/&mdash;/g, "-")
        .replace(/&hellip;/g, "...")
        .replace(/&amp;/g, "&")
        .replace(/<\/?[^>]+(>|$)/g, "") //remove HTML tags
        //remove remaining > 
        .replace(">", "")
        .replace("*", "")
        .replace("\n\n", "\n")
        //.replace("(?<=\\w)\\.\\.(?:\\s|$)", ".")
        .replace(/#{1,3} Response:/, "")
    ).trimEnd();
  }

  cutDownPrompt(prompt: string): string {
    const splitPrompt = prompt.split(">");
    const expendableText = splitPrompt.slice(2).join(">");
    return splitPrompt[0] + (expendableText ? `>${expendableText}` : "");
  }

  private async genOutput(response: any, history: any): Promise<void> {
    if (browser) {
      // biome-ignore lint/style/useNamingConvention: <explanation>
      let DGSS: any = {};
      DGSS = get(DungeonGameSettingsStore);
      let prompt = DGSS.llmTextSettings.prompt;
      let summary = "";
      const persona = await EnginePersonaStore.get(); //should get the data from the database
      if (history.length > 25) history.splice(0, history.length - 25);
      // Define the values for the placeholders
      const storySummary = "";
      const recent = history?.map((item: any) => item.content).join(" ") ?? "";

      // Replace %personaName% in personaDesc
      const updatedPersonaDesc = persona.personaDesc.replace(
        /%personaName%/g,
        persona.persona
      );

      console.log("prompt before replace: ", prompt);
      // Replace placeholders in the prompt
      const mPrompt = prompt
        .replace(
          /%personaName%/g,
          persona.persona ? `User's name: ${persona.persona}` : ""
        )
        .replace(
          /%personaDesc%/g,
          updatedPersonaDesc ? `Description of user: ${updatedPersonaDesc}` : ""
        )
        .replace(
          /%opening%/g,
          DGSS.game.opening ? `How it started: ${DGSS.game.opening}` : ""
        )
        .replace(
          /%plotEssentials%/g,
          DGSS.game.plotEssentials
            ? `Plot essentials: ${DGSS.game.plotEssentials}`
            : ""
        )
        .replace(
          /%authorsNotes%/g,
          DGSS.game.authorsNotes ? `${DGSS.game.authorsNotes}` : ""
        )
        .replace(
          /%storySummary%/g,
          storySummary ? `Story Summary: ${storySummary}` : ""
        )
        .replace(/%recent%/g, recent ? `Recent: ${recent}` : "")
        .trim();
      console.log("Prompt: ", mPrompt);
      const settings = {
        prompt: mPrompt,
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
        console.log(
          "Requesting from LLM",
          `/api/llm/provider/${DGSS.llmActive}/chat`
        );
        console.log("with settings", settings);
        const answer = await response.request(
          new Request(`/api/llm/provider/${DGSS.llmActive}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
          })
        );
        console.error("Answer from LLM: ", answer);
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
        //save conversations to database
        DungeonConversationStore.save(DGSS.game.id);
      } catch (error: any) {
        console.log("Error in genOutput: ", error);
        return error;
      }
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
        store.llmTextSettings.generateNum =
          store.llmTextSettings.defaultGenNum * 1.5;
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
