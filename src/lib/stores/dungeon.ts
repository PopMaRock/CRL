import { writable, type Writable } from 'svelte/store'

export const DungeonGameStateStore: Writable<any> = writable({
	lootBox: [],
	placeAndTime: {},
	shop: [],
	choices: [],
	enemy: {},
	event: { inCombat: false, shopMode: null, lootMode: false },
	meta: {
		created: Date.now(),
		lastPlay: Date.now()
	}
})
export const DungeonConversationStore: Writable<DungeonConversation[]> = writable([]);
export const DungeonGameSettingsStore: Writable<DungeonGameSettings>=writable();
export const DungeonPlayerStore: Writable<DungeonPlayer> = writable()
export const DungeonCharacterStore: Writable<any> = writable({
	characters: []
})

//defaults:

//DungeonGameSettings
export const DungeonGameSettingsDefault: DungeonGameSettings = {
    llm: {
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
            generateNum: 100,
            defaultGenNum: 100,
            temperature: 0.7,
            topP: 0.95,
            topK: 50,
            batchSize: 1,
            presencePenalty: 0.5,
            frequencyPenalty: 1.5,
            seed: -1
        }
    },
    game: {
        name: 'Dungeon Crawler',
        description: 'A text-based dungeon crawler game.',
        createdBy: 'CRL',
        plotEssentials: `You are a novice bounty hunter pursuing a cunning succubus demoness named Ava, accompanied by your magical talking goat companion, Goaty McGoatFace. Together, you set off on your journey to capture her and claim the reward to spend on bitches and beer, braving its horrors and depravities.`,
        authorsNotes: []
    },
    accessability: {
        fadein: true,
        text: 'normal' //can be print, clean, hacker
    },
    behaviour: {
        autoSave: true,
        autoSaveInterval: 60000
    }
};
//DungeonGameState
export const DungeonGameStateDefault: DungeonGameState = {
    lootBox: [],
    placeAndTime: {},
    shop: [],
    choices: [],
    enemy: {},
    gameEvent: { inCombat: false, shopMode: null, lootMode: false },
    meta: {
        created: Date.now(),
        lastPlay: Date.now()
    }
};
//DungeonPlayer
export const DungeonPlayerDefault: DungeonPlayer = {
        name: '',
        gender: '',
        visual: '',
        background: '',
        class: '',
        level: 1,
        xp: 0,
        nextLevel: 100,
        stats: [{ hp: 0, maxHp: 0, mp: 0, maxMp: 0 }],
        gold: 0,
        spells: [],
        inventory: []
};
