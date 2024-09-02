import { error } from '@sveltejs/kit'
import { ChatOpenAI } from '@langchain/openai'
import { CallbackManager } from '@langchain/core/callbacks/manager'
import { HumanMessage,AIMessage,SystemMessage} from "@langchain/core/messages";
interface Settings {
	generate_num: number
	default_gen_num: number
	temp: number
	top_p: number
	batch_size: number
	presence_penalty: number
	frequency_penalty: number
	seed: number
	baseURL?: string // Optional property
}

export const POST = async ({ request }) => {
	const body = await request.json()
	if (!body) throw error(400, 'Missing Data')
	const {
		systemPrompt,
		history,
		model,
		settings
	}: { systemPrompt: string; history: any; model: string; settings: Settings } = body // history should be passed

	// On to AI pish....
	let apiConfig: any = { apiKey: 'lm-studio', configuration: {} }
	if (settings.baseURL) apiConfig.configuration.baseURL = settings.baseURL
	//create the new message object
	apiConfig = {
		...apiConfig,
		//model: model ?? 'mradermacher/FuseChat-Kunoichi-10.7B-i1-GGUF',
		temperature: settings.temp,
		streaming: true,
		topP: settings.top_p,
		maxTokens: settings.generate_num,
		presencePenalty: settings.presence_penalty,
		frequencyPenalty: settings.frequency_penalty,
		seed: settings.seed
	}
	//prune history to 25 messages from the end
	if (history.length > 25) history.splice(0, history.length - 25)
	
	/**
	 * Creates a readable stream for processing completion chunks.
	 *
	 * @param {AsyncIterable<Completion>} completion - The async iterable of completion chunks.
	 * @returns {ReadableStream} - The readable stream for processing completion chunks.
	 */
	// Initialize the conversation chain with the chat prompt and memory
	// Create a new readable stream of the chat response
	console.log('apiConfig before we begin', apiConfig);

	const readableStream = new ReadableStream({
		async start(controller) {
			const model = new ChatOpenAI({
				...apiConfig,
				callbackManager: CallbackManager.fromHandlers({
					handleLLMNewToken: async (token: string) => controller.enqueue(token)
				})
			})
			await model.invoke([
				new SystemMessage(systemPrompt),
				new AIMessage(
					'A dark a lonely road, you begin your journey in Nathe as a young bounty hunter. You have been tasked with finding the elusive, lustful demon Ava of the kingdom of Nathe. You have been traveling for days and have finally reached the edge of the forest. You can see the a village in the distance, but you know that the journey ahead will be dangerous. You take a deep breath and step into the forest, ready to face whatever challenges come your way.'
				),
				...history.map(((chat:any) =>
					chat.role == 'user' ? new HumanMessage(chat.content) : new AIMessage(chat.content)
				))
			])
			controller.close()
		}
	})

	// Create and return a response of the readable stream
	return new Response(readableStream, {
		headers: { 'Content-Type': 'text/plain' }
	})
}
