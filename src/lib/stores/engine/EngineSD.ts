import { writable, type Writable } from "svelte/store";

// biome-ignore lint/style/useNamingConvention: <explanation>
export const EngineSDStore: Writable<any> = writable({
    sdActive: "webui",
    sd: {
      webui: {
        baseUrl: "http://localhost:1234/v1",
        requireApiKey: false,
        model: "webui",
        abilities: {
          layerDiffuse: true, // can create transparent imagery
          controlNet: {
            reference: true, // can use a reference image
            faceId: true, // can use a face id
          },
          fancyVideo: false, // can create video
        },
      },
      civitai: {
        baseUrl: "http://civitai.com/api",
        requireApiKey: true,
        model: "civitai",
        abilities: {
          layerDiffuse: false,
          controlNet: {
            reference: false,
            faceId: false,
          },
          fancyVideo: false,
        },
      },
    },
  });