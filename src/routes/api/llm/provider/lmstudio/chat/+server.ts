/**
 * May switch to LMStudio SDK in the future but for now, LangChain OpenAI will do.
 */

import { ChatOpenAI, type ChatOpenAIFields } from "@langchain/openai";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import { SystemMessage } from "@langchain/core/messages";
import { er, resp } from "$utilities/apiHelper";

interface Settings {
  generateNum: number;
  defaultGenNum: number;
  temperature: number;
  topP: number;
  topK: number;
  batchSize: number;
  presencePenalty: number;
  frequencyPenalty: number;
  seed: number;
  stream: boolean;
  baseUrl?: string; // Optional property
}

export const POST = async ({ request }) => {
  const body = await request.json();
  if (!body) return resp({ error: er.badRequest.missing }, 400);

  const {
    prompt,
    model,
    settings,
  }: { prompt: string; model: string; settings: Settings } =
    body;

  let apiConfig: ChatOpenAIFields = {
    apiKey: "NA",
    // biome-ignore lint/style/useNamingConvention: <explanation>
    configuration: { baseURL: settings.baseUrl },
  };

  apiConfig = {
    ...apiConfig,
    temperature: settings.temperature,
    streaming: settings.stream,
    topP: settings.topP,
    //topK: settings.topK,
    maxTokens: settings.generateNum,
    presencePenalty: settings.presencePenalty,
    frequencyPenalty: settings.frequencyPenalty,
    //seed: settings.seed,
  };

  //Check token count against context limit. If over, trucate from middle or start (depending on what user has picked.)
  if (settings.stream) {
    const readableStream = new ReadableStream({
      async start(controller) {
        const model = new ChatOpenAI({
          ...apiConfig,
          callbackManager: CallbackManager.fromHandlers({
            // biome-ignore lint/style/useNamingConvention: nae influence over this function name
            handleLLMNewToken: async (token: string) =>
              controller.enqueue(token),
          }),
        });
        try {
          await model.invoke([new SystemMessage(prompt)]);
        } catch (e) {
          console.log("error", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" },
    });
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const llm = new ChatOpenAI({ ...apiConfig }); // Pass apiConfig as an object
    try {
      const response = await llm.invoke([new SystemMessage(prompt)]);
      return new Response(response.content.toString(), {
        headers: { "Content-Type": "text/plain" },
      });
    } catch (e) {
      console.log("error", e);
      return new Response(JSON.stringify({ error: er.serverFail }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
