import { ChatOpenAI, type ChatOpenAIFields } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { er, resp } from "$utilities/apiHelper";

interface Settings {
  maxTokens: number;
  temperature: number;
  topP: number;
  //topK: number;
  //batchSize: number;
  presencePenalty: number;
  frequencyPenalty: number;
  // seed: number;
  streaming: boolean;
  baseUrl?: string; // Optional property
}

export const POST = async ({ request }) => {
  const body = await request.json();
  if (!body) return resp({ error: er.badRequest.missing }, 400);

  const {
    prompt,
    model,
    userMessage,
    settings,
  }: {
    prompt: string;
    model?: string;
    userMessage?: string;
    settings: Settings;
  } = body;

  let apiConfig: ChatOpenAIFields = {
    apiKey: "NA",
    // biome-ignore lint/style/useNamingConvention: <retarded name conventions - LangChainJS issue>
    configuration: { baseURL: settings.baseUrl ?? "http://localhost:1234/v1" },
  };

  apiConfig = {
    ...apiConfig,
    temperature: settings.temperature ?? 0.1,
    streaming: settings.streaming ?? false,
    topP: settings.topP ?? 0.95,
    //topK: settings.topK ?? 50,
    maxTokens: settings.maxTokens ?? 100,
    presencePenalty: settings.presencePenalty ?? 0,
    frequencyPenalty: settings.frequencyPenalty ?? 0,
    //seed: settings.seed ?? -1,
  };

  console.log("apiConfig before we begin", apiConfig);
  const mPrompt = `${prompt}`.trim();
  // Check token count against context limit. If over, truncate from middle or start (depending on what user has picked).
  const llm = new ChatOpenAI({ ...apiConfig }); // Pass apiConfig as an object

  try {
    const messages = [new SystemMessage(mPrompt)];

    if (userMessage) {
      messages.push(new HumanMessage(userMessage));
    }

    const response = await llm.invoke(messages);
    console.log("response", response);
    return resp({ response: response.content }, 200);
  } catch (e) {
    console.log("error", e);
    return resp({ e }, 500);
  }
};
