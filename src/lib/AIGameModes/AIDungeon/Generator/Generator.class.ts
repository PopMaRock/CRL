import { cutTrailingSentence, firstToSecondPerson } from '..//Story/utils'
import { get } from 'svelte/store'
import { get_similarity } from '$lib/utils/Similarity'
import { DungeonConversationStore, DungeonGameSettingsStore } from '$stores/dungeon'
import { EngineLlmStore } from '$stores/engine'

export class Generator {
	constructor() {
		//no constructor
	}

	expandPath(path: string): string {
		return path.replace('~', process.env.HOME || '')
	}

	prompt_replace(prompt: string): string {
		prompt = prompt.replace('#', '')
		prompt = prompt.replace('*', '')
		prompt = prompt.replace('\n\n', '\n')
		prompt = prompt.replace(/(?<=\w)\.\.(?:\s|$)/g, '.')
		prompt = prompt.trimEnd()
		return prompt
	}

	resultReplace(result: string, actions: string[]=[]): string {
		result = result.replace('."', '".')
		result = result.replace('#', '')
		result = result.replace('*', '')
		result = result.replace('\n\n', '\n')
		result = result.replace('(?<=\\w)\\.\\.(?:\\s|$)', '.')
		result = result.replace(/#{1,3} Response:/, ''); //bullshit Llama response pish.
		result = cutTrailingSentence(result)
		result = result.trimEnd()
		return result
	}

	cut_down_prompt(prompt: string): string {
		const split_prompt = prompt.split('>')
		const expendable_text = split_prompt.slice(2).join('>')
		return split_prompt[0] + (expendable_text ? `>${expendable_text}` : '')
	}

	private async gen_output(response: any, history: any): Promise<void> {
		const DGSS = get(DungeonGameSettingsStore);
		const settings = {
			systemPrompt: DGSS.llm.llmTextSettings.prompt,
			history: history,
			model: DGSS.llm.llmTextSettings.model,
			settings: {
				stream: DGSS.llm.llmTextSettings.stream ?? false,
				baseURL: get(EngineLlmStore).llm[DGSS.llm.llmActive].baseURL,
				temperature: DGSS.llm.llmTextSettings.temperature,
				topP: DGSS.llm.llmTextSettings.topP,
				topK: DGSS.llm.llmTextSettings.topK,
				generateNum: DGSS.llm.llmTextSettings.generateNum,
				presencePenalty: DGSS.llm.llmTextSettings.presencePenalty,
				frequencyPenalty: DGSS.llm.llmTextSettings.frequencyPenalty,
				seed: DGSS.llm.llmTextSettings.seed
			}
		}
		console.log('Request to LLM: ', settings);
		try {
			const answer = await response.request(
				new Request(`/api/llm/${DGSS.llm.llmActive}/chat`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(settings)
				})
			)
			if(!answer) throw new Error('No response from LLM');
			const assistantMessage: DungeonConversation = {
				role: 'assistant',
				content: this.resultReplace(answer as string),
				meta: { timestamp: Date.now(), hasAudio: false },
				type: 'text'
			}
			//@ts-ignore
			DungeonConversationStore.update((conversations) => [...conversations, assistantMessage])
		} catch (error: any) {
			console.log('Error in gen_output: ', error)
			return error
		}
	}
	public async handleMessage(response: any, message: string, actionOption: string): Promise<void> {
		message = message.trim()
		message = message[0].toLowerCase() + message.slice(1)
		if (!['.', '?', '!'].includes(message.slice(-1))) {
			message += '.'
		}
		if (actionOption !== 'say') message = firstToSecondPerson(message)

		message =
			actionOption === 'do' ? '>' + message : actionOption === 'say' ? '"' + message + '"' : message

		if (['say', 'ask', '"'].some((substring) => message.includes(substring))) {
			//this.generate_num = 150
		}

		message = this.prompt_replace(message)
		const last_prompt = message.includes('>') ? message.split('>').pop() : message
		//If it's a continue, don't add the user message to the conversation
		console.log('Action option in Generator: ', actionOption)
		if (actionOption !== 'continue') {
			console.log('Adding message to conversation')
			//@ts-ignore
			AIDConversation.update((conversations) => [
				...conversations,
				{
					role: actionOption === 'story' ? 'assistant' : 'user',
					content: message,
					meta: { timestamp: Date.now(), hasAudio: false },
					type: 'text'
				}
			])
		}
		//Build the history as LLM will only accept [{role: '', content: ''}] format
		const history = get(DungeonConversationStore).map((conversation) => {
			return { role: conversation.role, content: conversation.content }
		})
		try {
			await this.gen_output(response, history) //do generation
		} catch (error) {
			console.log('Error in handleMessage: ', error)
		}

		let tempStory: any = get(DungeonConversationStore)
		if (tempStory.length >= 2) {
			const similarity = get_similarity(
				tempStory[tempStory.length - 1].content,
				tempStory[tempStory.length - 2].content
			)
			if (similarity > 0.9) {
				tempStory.pop()
			}
		}
		//feed tempStory back into AIDConversation
		//@ts-ignore
		AIDConversation.set(tempStory)
	}
}
