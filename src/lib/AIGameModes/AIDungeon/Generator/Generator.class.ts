import { cutTrailingSentence, firstToSecondPerson } from '..//Story/utils'
import { get } from 'svelte/store'
import { get_similarity } from '$lib/utils/Similarity'
import { AIDConversation } from '$stores/stores'

export class Generator {
	generate_num: number
	default_gen_num: number
	temp: number
	top_p: number
	batch_size: number
	presence_penalty: number
	frequency_penalty: number
	seed: number
	baseURL?: string // Optional property
	output: any
	public prompt: string = `You are an AI dungeon master that provides any kind of roleplaying game content.

Instructions:

- Be specific, descriptive, and creative.
- Avoid repetition and avoid summarization.
- Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.
- Never decide or write for the user. If the input ends mid sentence, continue where it left off. ">" tokens mean a character action attempt. You should describe what happens when the player attempts that action.
- Make sure you always give responses continuing mid sentence even if it stops partway through.`

	constructor(
		generate_num = 80,
		temperature = 0.8,
		top_p = 0.9,
		presence_penalty = 0,
		frequency_penalty = 0,
		seed = 1
	) {
		this.generate_num = generate_num
		this.default_gen_num = generate_num
		this.temp = temperature
		this.top_p = top_p
		this.batch_size = 1
		this.presence_penalty = presence_penalty
		this.frequency_penalty = frequency_penalty
		this.seed = seed
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
		const settings = {
			systemPrompt: this.prompt,
			history: history,
			model: 'mradermacher/FuseChat-Kunoichi-10.7B-i1-GGUF',
			settings: {
				baseURL: 'http://localhost:1234/v1/',
				temp: this.temp,
				top_p: this.top_p,
				generate_num: this.generate_num,
				presence_penalty: this.presence_penalty,
				frequency_penalty: this.frequency_penalty,
				seed: this.seed
			}
		}
		console.log('Request to LLM: ', settings);
		try {
			const answer = await response.request(
				new Request('/api/chat/openai', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(settings)
				})
			)
			if(!answer) throw new Error('No response from LLM');
			const assistantMessage: Chat = {
				role: 'assistant',
				content: this.resultReplace(answer as string),
				meta: { timestamp: Date.now(), hasAudio: false },
				type: 'text'
			}
			//@ts-ignore
			AIDConversation.update((conversations) => [...conversations, assistantMessage])
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
			this.generate_num = 150
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
		const history = get(AIDConversation).map((conversation) => {
			return { role: conversation.role, content: conversation.content }
		})
		try {
			await this.gen_output(response, history) //do generation
		} catch (error) {
			console.log('Error in handleMessage: ', error)
		}

		let tempStory: any = get(AIDConversation)
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

	change_temp(t: number): boolean {
		const changed = t !== this.temp
		this.temp = t
		return changed
	}

	change_top_p(t: number): boolean {
		const changed = t !== this.top_p
		this.top_p = t
		return changed
	}
}
