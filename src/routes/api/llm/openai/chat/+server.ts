import { ChatOpenAI } from '@langchain/openai';
import { CallbackManager } from '@langchain/core/callbacks/manager';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { VITE_OPENAI_API_KEY } from '$env/static/private';
import { er, resp } from '$utilities/apiHelper';


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
    baseURL?: string; // Optional property
}


export const POST = async ({ request }) => {
    const body = await request.json();
    if (!body) return resp({error: er.badRequest.missing},400);

    const { systemPrompt, history, model, settings }: { systemPrompt: string; history: any; model: string; settings: Settings } = body;

    let apiConfig: any = { apiKey: VITE_OPENAI_API_KEY, configuration: {} };
    if (settings.baseURL) apiConfig.configuration.baseURL = settings.baseURL;

    apiConfig = {
        ...apiConfig,
        temperature: settings.temperature,
        streaming: settings.stream,
        topP: settings.topP,
        topK: settings.topK,
        maxTokens: settings.generateNum,
        presencePenalty: settings.presencePenalty,
        frequencyPenalty: settings.frequencyPenalty,
        seed: settings.seed
    };

    if (history.length > 25) history.splice(0, history.length - 25);

    console.log('apiConfig before we begin', apiConfig);

    const readableStream = new ReadableStream({
        async start(controller) {
            const model = new ChatOpenAI({
                ...apiConfig,
                callbackManager: CallbackManager.fromHandlers({
                    handleLLMNewToken: async (token: string) => controller.enqueue(token)
                })
            });

            try {
                await model.invoke([
                    new SystemMessage(systemPrompt),
                    new AIMessage(
                        'A dark and lonely road, you begin your journey in Nathe as a young bounty hunter. You have been tasked with finding the elusive, lustful demon Ava of the kingdom of Nathe. You have been traveling for days and have finally reached the edge of the forest. You can see a village in the distance, but you know that the journey ahead will be dangerous. You take a deep breath and step into the forest, ready to face whatever challenges come your way.'
                    ),
                    ...history.map((chat: any) =>
                        chat.role === 'user' ? new HumanMessage(chat.content) : new AIMessage(chat.content)
                    )
                ]);
            } catch (e) {
                console.log('error', e);
            } finally {
                controller.close();
            }
        }
    });
    
    return new Response(readableStream, {
        headers: { 'Content-Type': 'text/plain' }
    });
};
