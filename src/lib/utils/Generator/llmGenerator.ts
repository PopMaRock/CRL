import { get } from "svelte/store";
import { browser } from "$app/environment";
import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
import { EnginePersonaStore } from "$stores/engine/EnginePersona";
import { EngineLlmStore } from "$stores/engine/EngineLlm";
import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
import { DungeonManager } from "$stores/dungeon/DungeonManager";
import { firstToSecondPerson, promptReplace, resultReplace } from "$utilities/utils";
export class Generator {
  async genOutput(
    response: any,
    history: any,
    storySummary?: string
  ): Promise<void> {
    if (browser) {
      let DGSS: any = {};
      DGSS = get(DungeonGameSettingsStore);
      let prompt = DGSS.llmTextSettings.prompt;
      const persona = await EnginePersonaStore.get(); //should get the data from the database
      if (history.length > 25) history.splice(0, history.length - 25);
      // Define the values for the placeholders
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
        .replace(/%genre%/g, DGSS.game.genre ? `Genre: ${DGSS.game.genre}` : "")
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
          streaming: DGSS.llmTextSettings.stream ?? false,
          baseUrl: get(EngineLlmStore).llm[DGSS.llmActive].baseUrl,
          temperature: DGSS.llmTextSettings.temperature,
          topK: DGSS.llmTextSettings.topK,
          topP: DGSS.llmTextSettings.topP,
          maxTokens: DGSS.llmTextSettings.generateNum,
          presencePenalty: DGSS.llmTextSettings.presencePenalty,
          frequencyPenalty: DGSS.llmTextSettings.frequencyPenalty,
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
          content: answer as string,
          meta: { timestamp: Date.now(), hasAudio: false },
          type: "text",
        };
        //This will do a basic clean up and, if cleanUpText is true, it'll cut trailing sentences.
        assistantMessage.content = resultReplace(
          answer as string,
          true//DGSS.llmTextSettings.cleanUpText
        );

        DungeonConversationStore.update((conversations) => [
          ...conversations,
          assistantMessage,
        ]);
        //save conversations to database
        await DungeonConversationStore.save(DGSS.game.id);
      } catch (error: any) {
        console.log("Error in genOutput: ", error);
        return error;
      }
    }
  }
  async crlGenerate(
    weAre: "engine" | "game",
    prompt: string,
    maxTokens?: number,
    temperature?: number,
    topP?: number,
    topK?: number,
    frequencyPenalty?: number,
    presencePenalty?: number,
    streaming?: boolean,
    stop: string[] = []
  ): Promise<any> {
    let mStore: any;
    if (weAre === "engine") mStore = get(EngineLlmStore);
    else mStore = get(DungeonGameSettingsStore);
    console.log("Prompt from crlGenerate(): ", prompt);
    const requestBody = {
      model: mStore.llmTextSettings.model,
      prompt,
      settings: {
        baseUrl:
          mStore.llmActive === "lmstudio"
            ? get(EngineLlmStore).llm.lmstudio.baseUrl
            : "",
        maxTokens: maxTokens ?? mStore.llmTextSettings.genTokens ?? 300,
        temperature: temperature ?? mStore.llmTextSettings.temperature ?? 0.7,
        topP: topP ?? mStore.llmTextSettings.topP ?? 1,
        topK: topK ?? mStore.llmTextSettings.topK ?? 50,
        frequencyPenalty:
          frequencyPenalty ?? mStore.llmTextSettings.frequencyPenalty ?? 0.5,
        presencePenalty:
          presencePenalty ?? mStore.llmTextSettings.presencePenalty ?? 1.5,
        streaming: streaming ?? mStore.llmTextSettings.streaming ?? false,
      },
      stop: stop ?? [],
    };

    const fetchUrl = `/api/llm/provider/${mStore.llmActive}/rawchat`;
    console.log("Request body: ", requestBody);
    console.log("Fetch URL: ", fetchUrl);
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      throw new Error(data.error);
    }
    return data.response;
  }
  async handleMessage(
    response: any,
    message: string,
    actionOption: string,
    config: any //because browser can't fuckin access it //FIXME: Setup
  ): Promise<void> {
    let m = message.trim();
    console.log("m is", m);
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

    m = promptReplace(m);
    const lastPrompt = m.includes(">") ? m.split(">").pop() : m;
    //If it's a continue, don't add the user message to the conversation
    console.log("Action option in Generator: ", actionOption);
    if (actionOption !== "continue") {
      console.log("Adding message to conversation");
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
    let history = structuredClone(get(DungeonConversationStore));
    const dungeonManager = get(DungeonManager);
    const dgss = get(DungeonGameSettingsStore);
    //if autoSummarise is on, AND there is a summary, check config.summProtect and splice out the last config.summProtect messages from history
    let summaries = dungeonManager.summaries;
    if (dgss.llmTextSettings.autoSummarise !== false) {
      if (summaries.length > 0) {
        if (history.length > config.summProtect)
          history.splice(0, history.length - config.summProtect);
      }
    }
    console.log("History after bullshit splice ", history);

    await this.genOutput(
      response,
      history,
      summaries?.map((s: any) => s.summary).join("\n") ?? ""
    ); //do generation
    /*const tempStory: any = get(DungeonConversationStore);
    if (tempStory.length >= 2) {
      const similarity = getSimilarity(
        tempStory[tempStory.length - 1].content,
        tempStory[tempStory.length - 2].content
      );
      if (similarity > 0.9) {
        tempStory.pop();
        DungeonConversationStore.set(tempStory);
      }
    }*/
    //feed tempStory back into AIDConversation
    //@ts-ignore
  }
}
