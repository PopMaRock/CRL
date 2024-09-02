import { writable, type Writable } from 'svelte/store'

export const CRLSettingsStore: Writable<any> = writable({
    llmActive: 'openai',
    llmTextSettings: {
			stream: false,	
            generate_num: 1,
            default_gen_num: 1,
            temp: 0.7,
            top_p: 1,
            batch_size: 1,
            presence_penalty: 0,
            frequency_penalty: 0,
            seed: 0 
    },
	llm: {
		openai: {
			baseURL: 'https://api.openai.com/v1',
			model: 'gpt-3.5-turbo',
		},
        claude: {
            baseURL: 'https://claude.langchain.com',
            model: 'claude',
        },
        gemini: {
            baseURL: 'https://gemini.langchain.com',
            model: 'gemini',
        },
        lmstudio: {
            baseURL: 'http://localhost:1234/v1',
            model: 'lmstudio',
        },
	}
})
