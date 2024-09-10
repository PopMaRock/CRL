import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { VITE_OPENAI_API_KEY } from "$env/static/private";
import { er, resp } from "$utilities/apiHelper";

interface Settings {
  generateNum?: number;
  defaultGenNum?: number;
  temperature: number;
  topP: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  seed?: number;
  stream?: boolean;
  baseUrl?: string; // not set in openai
}

export const POST = async ({ request }) => {
  const body = await request.json();
  if (!body) return resp({ error: er.badRequest.missing }, 400);

  const {
    systemPrompt,
    model,
    settings,
  }: { systemPrompt: string; model: string; settings: Settings } = body;

  let apiConfig: any = { apiKey: VITE_OPENAI_API_KEY, configuration: {} };

  apiConfig = {
    ...apiConfig,
    model: model ?? "gpt-4o-mini",
    temperature: settings.temperature ?? 0.1,
    streaming: settings.stream ?? false,
    topP: settings.topP ?? 0.95,
    topK: settings.topK ?? 50,
    maxTokens: settings.generateNum ?? 100,
    presencePenalty: settings.presencePenalty ?? 0,
    frequencyPenalty: settings.frequencyPenalty ?? 0,
    seed: settings.seed ?? -1,
  };

  console.log("apiConfig before we begin", apiConfig);
  const mPrompt = `${systemPrompt}`.trim();
  // Check token count against context limit. If over, truncate from middle or start (depending on what user has picked).

  const llm = new ChatOpenAI({...apiConfig}); // Pass apiConfig as an object

  try {
    const response = await llm.invoke([new SystemMessage(mPrompt)]);
    console.log("response", response);
    return resp({ response: response.content }, 200);
  } catch (e:any) {
    console.log("error", e);
    return resp({ error: e.error.message }, 500);
  }
};
