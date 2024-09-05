import { error } from '@sveltejs/kit'
import { OpenAI } from 'openai'

interface Settings {
	generate_num: number
	default_gen_num: number
	temp: number
	top_p: number
	batch_size: number
	presence_penalty: number
	frequency_penalty: number
	seed: number
	baseUrl?: string // Optional property
}

export const POST = async ({ request }) => {
	const body = await request.json()
	if (!body) throw error(400, 'Missing Data')
	const {
		input,
		systemPrompt,
		history,
		model,
		settings
	}: { input: string; systemPrompt: string; history: any; model: string; settings: Settings } = body // history should be passed

	// On to AI pish....
	const apiConfig: any = { apiKey: 'lm-studio' }
	if (settings.baseUrl) apiConfig.baseUrl = settings.baseUrl
	const api = new OpenAI(apiConfig)
	//Inject system prompt
	history.unshift({ role: 'system', content: systemPrompt })
	//Inject the new message from the user

	console.log('HISTORY', history)
	//create the new message object
	const completion = await api.chat.completions.create({
		model: model ?? 'mradermacher/FuseChat-Kunoichi-10.7B-i1-GGUF',
		messages: history,
		temperature: settings.temp,
		stream: true,
		top_p: settings.top_p,
		max_tokens: settings.generate_num,
		presence_penalty: settings.presence_penalty,
		frequency_penalty: settings.frequency_penalty,
		seed: settings.seed
	})
	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	}
	/**
	 * Creates a readable stream for processing completion chunks.
	 *
	 * @param {AsyncIterable<Completion>} completion - The async iterable of completion chunks.
	 * @returns {ReadableStream} - The readable stream for processing completion chunks.
	 */
	const readableStream = new ReadableStream({
		async start(controller) {
			for await (const chunk of completionResponse) {
				controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`)
			}
			controller.close()
		}
	})

	// Create and return a response of the readable stream
	return new Response(stream, { headers })
}
