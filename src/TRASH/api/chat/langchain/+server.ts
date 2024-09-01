import path from 'path'
import { ChatOpenAI } from '@langchain/openai'
import { CallbackManager } from '@langchain/core/callbacks/manager'
import { ChatMessageHistory } from 'langchain/stores/message/in_memory'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate
} from '@langchain/core/prompts'
import { LocalIndex } from 'vectra';
import { error } from '@sveltejs/kit'

//Chat history is not working.

export const POST = async ({ request }) => {
	const body = await request.json()
	if (!body) throw error(400, 'Missing Data')
    const { input } = body

	let chain
	let chainWithHistory: any
	

	const chatPromptLLM = {
		temperature: 0.8,
		topP: 0.9,
		frequencyPenalty: 2.5,
		verbose: true,
		//streaming: true,
		maxTokens: 80,
		configuration: { baseURL: 'http://localhost:1234/v1/' },
		apiKey: 'lm-studio',
		streaming: true,
        cache: true
	}

	console.info('LangChainManager constructor')
	// Define the chat prompt template
	const chatPrompt = ChatPromptTemplate.fromMessages([
		SystemMessagePromptTemplate.fromTemplate(`You are an AI dungeon master that provides any kind of roleplaying game content.

Instructions:

- Be specific, descriptive, and creative.
- Avoid repetition and avoid summarization.
- Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.
- Never decide or write for the user. If the input ends mid sentence, continue where it left off. ">" tokens mean a character action attempt. You should describe what happens when the player attempts that action.
- Make sure you always give responses continuing mid sentence even if it stops partway through.
`),
		new MessagesPlaceholder('history'),
		HumanMessagePromptTemplate.fromTemplate('{input}')
	])

	// Initialize the conversation chain with the chat prompt and memory
	// Create a new readable stream of the chat response
	const readableStream = new ReadableStream({
		async start(controller) {
            const model = new ChatOpenAI({...chatPromptLLM, callbackManager: CallbackManager.fromHandlers({
                handleLLMNewToken: async (token: string) => controller.enqueue(token)
            })});
	        chain = chatPrompt.pipe(model)
            chainWithHistory = new RunnableWithMessageHistory({
                runnable: chain,
                getMessageHistory: (sessionId) => new ChatMessageHistory(),
                inputMessagesKey: 'input',
                historyMessagesKey: 'history'
            })
			await chainWithHistory.invoke(
				{ input },
				{
					configurable: {
						sessionId: 'foobarbaz'
					}
				}
			)
			controller.close()
		}
	})

	// Create and return a response of the readable stream
	return new Response(readableStream, {
		headers: { 'Content-Type': 'text/plain' }
	})
}
async function VectorManagement(){
	const index = new LocalIndex(path.join(__dirname, '..', 'index'));
	if (!await index.isIndexCreated()) {
		await index.createIndex();
	}
}
