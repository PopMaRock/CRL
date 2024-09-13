export const UPDATE_INTERVAL = 1000;
// This is a 1x1 transparent PNG
export const PNG_PIXEL =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
export const placeholderVae = "Automatic";
export const sources = {
  auto: "auto",
  forge: "forge",
};
export const generationMode = {
  MESSAGE: -1,
  CHARACTER: 0,
  USER: 1,
  SCENARIO: 2,
  RAW_LAST: 3,
  NOW: 4,
  FACE: 5,
  FREE: 6,
  BACKGROUND: 7,
  CHARACTER_MULTIMODAL: 8,
  USER_MULTIMODAL: 9,
  FACE_MULTIMODAL: 10,
  FREE_EXTENDED: 11,
};
export const multimodalMap = {
  [generationMode.CHARACTER]: generationMode.CHARACTER_MULTIMODAL,
  [generationMode.USER]: generationMode.USER_MULTIMODAL,
  [generationMode.FACE]: generationMode.FACE_MULTIMODAL,
};
export const modeLabels = {
  [generationMode.MESSAGE]: "Chat Message Template",
  [generationMode.CHARACTER]: 'Character ("Yourself")',
  [generationMode.FACE]: 'Portrait ("Your Face")',
  [generationMode.USER]: 'User ("Me")',
  [generationMode.SCENARIO]: 'Scenario ("The Whole Story")',
  [generationMode.NOW]: "Last Message",
  [generationMode.RAW_LAST]: "Raw Last Message",
  [generationMode.BACKGROUND]: "Background",
  [generationMode.CHARACTER_MULTIMODAL]: "Character (Multimodal Mode)",
  [generationMode.FACE_MULTIMODAL]: "Portrait (Multimodal Mode)",
  [generationMode.USER_MULTIMODAL]: "User (Multimodal Mode)",
  [generationMode.FREE_EXTENDED]: "Free Mode (LLM-Extended)",
};
export const triggerWords = {
  [generationMode.CHARACTER]: ["you"],
  [generationMode.USER]: ["me"],
  [generationMode.SCENARIO]: ["scene"],
  [generationMode.RAW_LAST]: ["raw_last"],
  [generationMode.NOW]: ["last"],
  [generationMode.FACE]: ["face"],
  [generationMode.BACKGROUND]: ["background"],
};
export const messageTrigger = {
  activationRegex:
    /\b(send|mail|imagine|generate|make|create|draw|paint|render|show)\b.{0,10}\b(pic|picture|image|drawing|painting|photo|photograph)\b(?:\s+of)?(?:\s+(?:a|an|the|this|that|those|your)?)?(.+)/i,
  specialCases: {
    [generationMode.CHARACTER]: ["you", "yourself"],
    [generationMode.USER]: ["me", "myself"],
    [generationMode.SCENARIO]: ["story", "scenario", "whole story"],
    [generationMode.NOW]: ["last message"],
    [generationMode.FACE]: ["your face", "your portrait", "your selfie"],
    [generationMode.BACKGROUND]: [
      "background",
      "scene background",
      "scene",
      "scenery",
      "surroundings",
      "environment",
    ],
  },
};
export const promptTemplates = {
  // Not really a prompt template, rather an outcome message template
  [generationMode.MESSAGE]:
    "[{{char}} sends a picture that contains: {{prompt}}].",
  /*OLD:     [generationMode.CHARACTER]: "Pause your roleplay and provide comma-delimited list of phrases and keywords which describe {{char}}'s physical appearance and clothing. Ignore {{char}}'s personality traits, and chat history when crafting this description. End your response once the comma-delimited list is complete. Do not roleplay when writing this description, and do not attempt to continue the story.", */
  [generationMode.CHARACTER]: "[In the next response, ONLY RESPOND WITH ONE COMMA-DELIMITATED LIST OF KEYWORDS TO DESCRIBE THE LAST MESSAGE. The keywords should be descriptive but concise, geared towards creating a full character portrait. Include the specified characteristics: Perspective, Camera Shot, Camera Angle, Camera Lens, Lighting, Location, Character Genders, Primary Action, and Characters in Scene (grouped by individual). They must include relevant descriptive and detailed explicit keywords, when appropriate. Only respond with the comma-separated keyword list.]",

  //face-specific prompt
  [generationMode.FACE]:
    "[In the next response I want you to provide only a detailed comma-delimited list of keywords and phrases which describe {{char}}. The list must include all of the following items in this order: name, species and race, gender, age, facial features and expressions, occupation, hair and hair accessories (if any), what they are wearing on their upper body (if anything). Do not describe anything below their neck. Do not include descriptions of non-visual qualities such as personality, movements, scents, mental traits, or anything which could not be seen in a still photograph. Do not write in full sentences. Prefix your description with the phrase 'close up facial portrait,']",
  //prompt for only the last message
  [generationMode.USER]:
    "[Pause your roleplay and provide a detailed description of {{user}}'s physical appearance from the perspective of {{char}} in the form of a comma-delimited list of keywords and phrases. The list must include all of the following items in this order: name, species and race, gender, age, clothing, occupation, physical features and appearances. Do not include descriptions of non-visual qualities such as personality, movements, scents, mental traits, or anything which could not be seen in a still photograph. Do not write in full sentences. Prefix your description with the phrase 'full body portrait,'. Ignore the rest of the story when crafting this description. Do not roleplay as {{char}} when writing this description, and do not attempt to continue the story.]",
  [generationMode.SCENARIO]:
    "[Pause your roleplay and provide a detailed description for all of the following: a brief recap of recent events in the story, {{char}}'s appearance, and {{char}}'s surroundings. Do not roleplay while writing this description.]",

  [generationMode.NOW]: `[Pause your roleplay. ONLY RESPOND WITH ONE COMMA-DELIMITATED LIST OF KEYWORDS TO DESCRIBE THE LAST MESSAGE. The keywords should be descriptive but concise, and should include the specified characteristics: Perspective, Camera Shot, Camera Angle, Camera Lens, Lighting, Location, Character Genders, Primary Action, and Characters in Scene (grouped by individual). They must include descriptive and detailed explicit keywords, when appropriate. Only respond with the comma-separated keyword list. For example: 'first person, close-up, wide-angle, 50mm, dimly lit, bedroom, 1girl 1boy, blowjob, (she: wet with sweat, hand on cock, licking tip, cum on chin)']`,

  [generationMode.RAW_LAST]:
    "[Pause your roleplay and provide ONLY the last chat message string back to me verbatim. Do not write anything after the string. Do not roleplay at all in your response. Do not continue the roleplay story.]",
  [generationMode.BACKGROUND]:
    "[Pause your roleplay and provide a detailed description of {{char}}'s surroundings in the form of a comma-delimited list of keywords and phrases. The list must include all of the following items in this order: location, time of day, weather, lighting, and any other relevant details. Do not include descriptions of characters and non-visual qualities such as names, personality, movements, scents, mental traits, or anything which could not be seen in a still photograph. Do not write in full sentences. Prefix your description with the phrase 'background,'. Ignore the rest of the story when crafting this description. Do not roleplay as {{user}} when writing this description, and do not attempt to continue the story.]",
  [generationMode.FACE_MULTIMODAL]:
    'Provide an exhaustive comma-separated list of tags describing the appearance of the character on this image in great detail. Start with "close-up portrait".',
  [generationMode.CHARACTER_MULTIMODAL]:
    'Provide an exhaustive comma-separated list of tags describing the appearance of the character on this image in great detail. Start with "full body portrait".',
  [generationMode.USER_MULTIMODAL]:
    'Provide an exhaustive comma-separated list of tags describing the appearance of the character on this image in great detail. Start with "full body portrait".',
  [generationMode.FREE_EXTENDED]:
    'Pause your roleplay and provide an exhaustive comma-separated list of tags describing the appearance of "{0}" in great detail. Start with {{charPrefix}} (sic) if the subject is associated with {{char}}.',
};

const defaultPrefix = "best quality, absurdres, aesthetic,";
const defaultNegative =
  "lowres, bad anatomy, bad hands, text, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry";

//------------------------------
export const defaultSettings = {
  //################################################################
  // CFG Scale
  scale_min: 1,
  scale_max: 30,
  scale_step: 0.5,
  // Sampler steps
  steps_min: 1,
  steps_max: 150,
  steps_step: 1,

  // controlnet
  clipskip_min: 1,
  clipskip_max: 12,
  clipskip_step: 1,

  // Image dimensions (Width & Height)
  dimension_min: 64,
  dimension_max: 2048,
  dimension_step: 64,
  width: 1024,
  height: 1024,

  prompt_prefix: defaultPrefix ?? "zPDXL2",
  negative_prompt: defaultNegative ?? "zPDXL2-neg",
  // Automatic1111/Forge exclusives
  restore_faces: false,
  enable_hr: false,

  // Refine mode
  refine_mode: false,
  expand: false,
  interactive_mode: false,
  multimodal_captioning: false,
  snap: false,
  free_extend: false,

  prompts: promptTemplates,

  // AUTOMATIC1111 settings
  // AUTOMATIC1111 settings
  auto_url: "http://localhost:7860",
  auto_auth: "",

  hr_upscaler: "Latent",
  hr_scale: 2.0,
  hr_scale_min: 1.0,
  hr_scale_max: 4.0,
  hr_scale_step: 0.1,
  denoising_strength: 0.7,
  denoising_strength_min: 0.0,
  denoising_strength_max: 1.0,
  denoising_strength_step: 0.01,
  hr_second_pass_steps: 0,
  hr_second_pass_steps_min: 0,
  hr_second_pass_steps_max: 150,
  hr_second_pass_steps_step: 1,

  // Visibility toggles
  wand_visible: false,
  command_visible: false,
  interactive_visible: false,
};
//Keys For Character Settings
export const char_settings = {
  positive: "positivePrompts",
  negative: "negativePrompts",
  model: "model",
  sampler: "sampler",
  resolution: "resolution",
  vae: "vae",
  scale: "scale",
  seed: "seed",
  scheduler: "scheduler",
  steps: "steps",
  width: "width",
  height: "height",
  clipskip: "clipskip",
  expression: "expression",
  cn: {
    enable: "enable",
    mode: "mode",
    model: "model",
    module: "module",
    lora: "lora",
    attachTo: "attachTo",
    inputRef: "inputRef",
    pixelperfect: "pixelperfect",
    prefer: "prefer",
    weight: "weight",
  },
  ad: {
    adetailer_mode: "adetailer_mode",
    adetailer_models: "adetailer_models",
    adetailer_weight: "adetailer_weight",
  },
  ao: {
    manual_ao_mode: "manual_ao_mode",
    ao_override: "ao_override",
  },
  freeU: "freeU",
};
export const expressYourself = {
  admiration:
    "widened eyes, raised eyebrows, and a slight smile conveying admiration and awe",
  amusement:
    "slight tilt of the head, mouth slightly open, and eyes sparkling with amusement",
  anger:
    "steely gaze, gritted teeth, and flushed cheeks reflecting simmering anger.",
  annoyance:
    "slight eye roll, pursed lips, and a tired expression reflecting annoyance",
  approval:
    "contented expression, eyebrows relaxed, and a soft gaze that conveys genuine approval",
  caring:
    "concern, brows furrowed slightly, and a soft, reassuring gaze reflecting caring.",
  confusion:
    "blank stare, mouth slightly agape, and a furrowed forehead showing a state of bewilderment and confusion.",
  curiosity:
    "contemplative smile, eyes searching for answers, and a curious gaze that invites exploration.",
  desire:
    "yearning, lips slightly parted, and eyes filled with longing and desire.",
  disappointment:
    "drooping shoulders, a pained expression, and eyes reflecting deep disappointment.",
  disapproval:
    "tight-lipped smile, eyes narrowed in disapproval, and a cold, distant expression.",
  disgust:
    "wide eyes, mouth slightly open in revulsion, and a recoiling expression showing disgust.",
  excitement:
    "bright smile, raised eyebrows, and cheerful expression radiating enthusiasm and excitement",
  embarrassment:
    "flushed cheeks, a sheepish smile, and eyes looking away in embarrassment.",
  fear: "sheer panic, mouth agape, and eyes filled with terror indicating deep fear.",
  gratitude:
    "a beaming smile, eyes crinkled at the corners, and a thankful gaze that exudes deep gratitude.",
  grief:
    "pained expression, eyes filled with sorrow, and a trembling lip signaling profound grief.",
  joy: "exuding excitement and joy. Energetic and lively expression, ensuring a sense of positivity",
  love: "contentment, eyes locked in a loving gaze, and a serene smile showing unconditional love.",
  nervousness:
    "tense expression, averted gaze, and a trembling lip reflecting nervousness.",
  neutral:
    "relaxed expression, neutral gaze, and a subtle smile showing a calm and neutral emotion.",
  optimism:
    "bright smile, eyes full of hope, and an upbeat expression reflecting optimism and positivity.",
  pride:
    "confident smile, raised chin, and a gleam in the eyes reflecting a strong sense of pride.",
  realization:
    "with widened eyes, a sudden look of understanding, and a subtle expression of realization dawning upon the individual.",
  relief:
    "relaxed smile, eyes closed in relief, and a visible exhale conveying a sense of relief and comfort.",
  remorse:
    "downcast eyes, a pained expression, and a look of regret and sorrow reflecting deep remorse.",
  sadness:
    "downturned lips, teary eyes, and a somber expression conveying profound sadness and emotional pain.",
  surprise:
    "wide eyes, dropped jaw, and eyebrows raised in astonishment conveying a sense of surprise and shock.",
};
export const defaultCharacterSettings = {
  positivePrompts: defaultPrefix,
  negativePrompts: defaultNegative,
  model: "",
  resolution: "sd_res_1024x1024",
  vae: "Automatic",
  scale: 7.0,
  steps: 20,
  seed: -1,
  // Scheduler
  sampler: "Euler a",
  scheduler: "Karras",
  clipskip: 2,
  expression: "neutral",
  cn: {
    mode: false,
    ref: {
      enable: false,
      attachTo: [6, 4, 1, 3],
      inputRef: "char",
      pixelperfect: false,
      prefer: "Balanced",
      weight: 0.6,
    },
    fid: {
      enable: false,
      model: "",
      module: "",
      lora: "",
      attachTo: [6, 4, 1, 3],
      inputRef: "char",
      pixelperfect: false,
      weight: 0.6,
    },
  },
  ad: {
    adetailer_mode: false,
    adetailer_models: [],
    adetailer_weight: 0.3,
  },
  ao: {
    manual_ao_mode: false,
    ao_override: "",
  },
  freeU: "",
};
export const resolutionOptions = {
  sd_res_512x512: {
    width: 512,
    height: 512,
    name: "512x512 (1:1, icons, profile pictures)",
  },
  sd_res_600x600: {
    width: 600,
    height: 600,
    name: "600x600 (1:1, icons, profile pictures)",
  },
  sd_res_512x768: {
    width: 512,
    height: 768,
    name: "512x768 (2:3, vertical character card)",
  },
  sd_res_768x512: {
    width: 768,
    height: 512,
    name: "768x512 (3:2, horizontal 35-mm movie film)",
  },
  sd_res_960x540: {
    width: 960,
    height: 540,
    name: "960x540 (16:9, horizontal wallpaper)",
  },
  sd_res_540x960: {
    width: 540,
    height: 960,
    name: "540x960 (9:16, vertical wallpaper)",
  },
  sd_res_1920x1088: {
    width: 1920,
    height: 1088,
    name: "1920x1088 (16:9, 1080p, horizontal wallpaper)",
  },
  sd_res_1088x1920: {
    width: 1088,
    height: 1920,
    name: "1088x1920 (9:16, 1080p, vertical wallpaper)",
  },
  sd_res_1280x720: {
    width: 1280,
    height: 720,
    name: "1280x720 (16:9, 720p, horizontal wallpaper)",
  },
  sd_res_720x1280: {
    width: 720,
    height: 1280,
    name: "720x1280 (9:16, 720p, vertical wallpaper)",
  },
  sd_res_1024x1024: {
    width: 1024,
    height: 1024,
    name: "1024x1024 (1:1, SDXL)",
  },
  sd_res_1152x896: { width: 1152, height: 896, name: "1152x896 (9:7, SDXL)" },
  sd_res_896x1152: { width: 896, height: 1152, name: "896x1152 (7:9, SDXL)" },
  sd_res_1216x832: {
    width: 1216,
    height: 832,
    name: "1216x832 (19:13, SDXL)",
  },
  sd_res_832x1216: {
    width: 832,
    height: 1216,
    name: "832x1216 (13:19, SDXL)",
  },
  sd_res_1344x768: { width: 1344, height: 768, name: "1344x768 (4:3, SDXL)" },
  sd_res_768x1344: { width: 768, height: 1344, name: "768x1344 (3:4, SDXL)" },
  sd_res_1536x640: {
    width: 1536,
    height: 640,
    name: "1536x640 (24:10, SDXL)",
  },
  sd_res_640x1536: {
    width: 640,
    height: 1536,
    name: "640x1536 (10:24, SDXL)",
  },
};
