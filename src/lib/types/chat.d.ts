interface Meta {
    timestamp: number;
    hasAudio: boolean;
}

interface Audio {
    url: string;
    duration: number;
    type: string; // 'voiceOver', 'backgroundMusic', 'soundEffect'
    generator: string; // 'elevenlabs', 'localXtts', 'localTts'
}

interface Chat {
    role: string;
    content: string;
    meta: Meta;
    audio?: Audio;
    type: string; // 'text', 'image', 'video', 'audio'
}


