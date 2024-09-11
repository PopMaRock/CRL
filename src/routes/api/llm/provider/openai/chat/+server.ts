import { ChatOpenAI } from "@langchain/openai";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import {
  SystemMessage,
} from "@langchain/core/messages";
import { VITE_OPENAI_API_KEY } from "$env/static/private";
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
    settings,
  }: { prompt: string; model: string; settings: Settings } =
    body;
  let apiConfig: any = { apiKey: VITE_OPENAI_API_KEY, configuration: {} };

  apiConfig = {
    ...apiConfig,
    model: model ?? "gpt-4o-mini",
    temperature: settings.temperature,
    streaming: settings.streaming,
    topP: settings.topP,
    presencePenalty: settings.presencePenalty,
    frequencyPenalty: settings.frequencyPenalty,
    //topK: settings.topK,
    maxTokens: settings.maxTokens,
  };
  //Check token count against context limit. If over, trucate from middle or start (depending on what user has picked.)
    if (settings.streaming) {
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
            /*await model.invoke([
                    new SystemMessage(systemPrompt),
                    new AIMessage(
                        'A dark and lonely road, you begin your journey in Nathe as a young bounty hunter. You have been tasked with finding the elusive, lustful demon Ava of the kingdom of Nathe. You have been traveling for days and have finally reached the edge of the forest. You can see a village in the distance, but you know that the journey ahead will be dangerous. You take a deep breath and step into the forest, ready to face whatever challenges come your way.'
                    ),
                    ...history.map((chat: any) =>
                        chat.role === 'user' ? new HumanMessage(chat.content) : new AIMessage(chat.content)
                    )
                ]);*/
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
