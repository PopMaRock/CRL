//god, this is a fuckin mess...

interface DungeonGameSettings {
    llmActive: 'openai' | 'claude' | 'gemini' | 'lmstudio';
    llmTextSettings: LLMTextSettings;
    game: Game;
    sd?: SD;
    vo?: VO;
    accessability?: Accessibility;
    behaviour?: Behaviour;
}
interface DungeonGameState {
    lootBox: any[];
    placeAndTime: Record<string, any>;
    shop: any[];
    choices: any[];
    enemy: Record<string, any>;
    gameEvent: GameEvent;
    meta: Meta;
}
interface DungeonConversation {
    role: string;
    content: string;
    meta: Meta;
    audio?: Audio;
    type: string; // 'text', 'image', 'video', 'audio'
}
interface DungeonPlayer {
    name: string;
    gender: string;
    visual: string;
    background: string;
    class: string;
    level: number;
    xp: number;
    nextLevel: number;
    stats: Stats[];
    gold: number;
    spells: any[];
    inventory: any[];
}
interface Stats {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
}

interface Audio {
    url: string;
    duration: number;
    type: string; // 'voiceOver', 'backgroundMusic', 'soundEffect'
    generator: string; // 'elevenlabs', 'localXtts', 'localTts'
}
//LLM Interface
interface LLMTextSettings {
    prompt: string;
    model?: string;
    stream: boolean;
    limitContext: number;
    memoryBank: boolean;
    autoSummarize: boolean | 'local' | 'main';
    historyTruncate: 'start' | 'middle'
    convertToUkEnglish: boolean;
    generateNum: number;
    defaultGenNum: number;
    temperature: number;
    topP: number;
    topK: number;
    presencePenalty: number;
    frequencyPenalty: number;
    seed: number;
}
interface Game {
    id: string | null;
    name: string;
    description: string;
    createdBy: string;
    genre: string;
    image: string;
    opening: string;
    plotEssentials: string;
    authorsNotes: string;
    storySummary: string;
    sd: boolean;
    vo: boolean;
}
interface SD {
    sdActive: string;
    sdDefaultPositive: string;
    sdDefaultNegative: string;
}
interface VO {
    voActive: string;
    voDefaultPositive: string;
    voDefaultNegative: string;
    model: string;
}
interface Accessibility {
    fadein: boolean;
    text: 'normal' | 'print' | 'clean' | 'hacker';
}

interface Behaviour {
    autoSave: boolean;
    autoSaveInterval: number;
}
interface GameEvent {
    inCombat: boolean;
    shopMode: boolean | null;
    lootMode: boolean;
}

interface Meta {
    created?: number;
    lastPlay?: number;
    timestamp?: number;
    hasAudio?: boolean;
}