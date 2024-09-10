import { writable, type Writable } from "svelte/store";

export const EngineVoiceStore: Writable<any> = writable({
    voiceActive: "elevenlabs",
    voice: {
      elevenlabs: {
        baseUrl: "http://localhost:1234/",
        requireApiKey: false,
        model: "elevenlabs",
      },
      google: {
        baseUrl: "https://texttospeech.googleapis.com/v1",
        requireApiKey: true,
        model: "google",
      },
    },
  });