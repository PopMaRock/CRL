/**
 * May switch to LMStudio SDK in the future but for now, LangChain OpenAI will do.
 */

import { ChatOpenAI } from "@langchain/openai";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import {
  SystemMessage,
} from "@langchain/core/messages";
import { VITE_OPENAI_API_KEY } from "$env/static/private";
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
    systemPrompt,
    history,
    model,
    settings,
  }: { systemPrompt: string; history: any; model: string; settings: Settings } =
    body;
  let apiConfig: any = { apiKey: VITE_OPENAI_API_KEY, configuration: {} };
  let summary = "";

  if (settings.baseUrl) apiConfig.configuration.baseUrl = settings.baseUrl;

  apiConfig = {
    ...apiConfig,
    temperature: settings.temperature,
    streaming: settings.stream,
    topP: settings.topP,
    topK: settings.topK,
    maxTokens: settings.generateNum,
    presencePenalty: settings.presencePenalty,
    frequencyPenalty: settings.frequencyPenalty,
    seed: settings.seed,
  };

  if (history.length > 25) history.splice(0, history.length - 25);

  console.log("apiConfig before we begin", apiConfig);
  const mPrompt = `
            ${systemPrompt}
            ${summary ? `\n\nSummary: ${summary}\n\n` : ""}
            Recent: ${history?.map((item: any) => item.content).join(" ")??''}
            `.trim();
  //Check token count against context limit. If over, trucate from middle or start (depending on what user has picked.)
  
  const readableStream = new ReadableStream({
    async start(controller) {
      const model = new ChatOpenAI({
        ...apiConfig,
        callbackManager: CallbackManager.fromHandlers({
          // biome-ignore lint/style/useNamingConvention: nae influence over this function name
          handleLLMNewToken: async (token: string) => controller.enqueue(token),
        }),
      });
      try {
        await model.invoke([new SystemMessage(mPrompt)]);
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
};
