import { writable, type Writable } from 'svelte/store'
/**
 * These are engine settings for the Dungeon game mode.
 * They are super-seeded by the Dungeon game settings.
 * These are defaults that the user can edit before entering the game. Each Dungeon game will have it's own settings.
 * User will have option to 'set as default' in game settings.
 **/
export const EngineFeaturesStore: Writable<any> = writable({
	sd: true,
	voice: true,
	video: false
})

export const EngineLlmStore: Writable<any> = writable({
	llmActive: 'openai',
	llmTextSettings: {
		prompt: `You are an AI dungeon master that provides any kind of roleplaying game content.

Instructions:
- Be specific, descriptive, and creative.
- Avoid repetition and avoid summarization.
- Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.
- Never decide or write for the user. If the input ends mid sentence, continue where it left off. ">" tokens mean a character action attempt. You should describe what happens when the player attempts that action.
- Make sure you always give responses continuing mid sentence even if it stops partway through.`,
		model: 'gpt-3.5-turbo',
		stream: false,
		limitContext: 4096,
		memoryBank: true, //using vectera local
		autoSummarize: false, //Can be false, local or main
		convertToUKEnglish: true,
		generateNum: 100,
		defaultGenNum: 100,
		temperature: 0.7,
		topP: 0.95,
		topK: 50,
		batchSize: 1,
		presencePenalty: 0.5,
		frequencyPenalty: 1.5,
		seed: -1
	},
	llm: {
		openai: {
			baseURL: 'https://api.openai.com/v1',
			model: 'gpt-3.5-turbo'
		},
		claude: {
			baseURL: 'https://claude.langchain.com',
			model: 'claude'
		},
		gemini: {
			baseURL: 'https://gemini.langchain.com',
			model: 'gemini'
		},
		lmstudio: {
			baseURL: 'http://localhost:1234/v1',
			model: 'lmstudio'
		}
	}
})

export const EngineSDStore: Writable<any> = writable({
	sdActive: 'webui',
	sd: {
		webui: {
			baseURL: 'http://localhost:1234/v1',
			requireApiKey: false,
			model: 'webui',
			abilities: {
				layerDiffuse: true, // can create transparent imagery
				controlNet: {
					reference: true, // can use a reference image
					faceId: true // can use a face id
				},
				fancyVideo: false // can create video
			}
		},
		civitai: {
			baseURL: 'http://civitai.com/api',
			requireApiKey: true,
			model: 'civitai',
			abilities: {
				layerDiffuse: false,
				controlNet: {
					reference: false,
					faceId: false
				},
				fancyVideo: false
			}
		}
	}
})

export const EngineVoiceStore: Writable<any> = writable({
	voiceActive: 'elevenlabs',
	voice: {
		elevenlabs: {
			baseURL: 'http://localhost:1234/v1',
			requireApiKey: false,
			model: 'elevenlabs'
		},
		google: {
			baseURL: 'https://texttospeech.googleapis.com/v1',
			requireApiKey: true,
			model: 'google'
		}
	}
})
