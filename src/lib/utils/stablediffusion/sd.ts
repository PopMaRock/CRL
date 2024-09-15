import { getConfig } from "$lib/config";
import { resolutionOptions } from "$stores/dungeon/DungeonSd";
import { addAlwaysOnScripts } from "./alwaysOnScripts";

const config = getConfig();
/**
 * Find a closest resolution option match for the current width and height.
 */
export function getClosestKnownResolution(width: number,height: number) {
  let resolutionId = null;
  let minTotalDiff = Number.POSITIVE_INFINITY;

  //round width and height to the nearest 64
  const w = Math.round((width * 1.5) / 64) * 64;
  const h = Math.round((height * 1.5) / 64) * 64;
  const targetAspect =
    w / h;
  const targetResolution =
    w * h;

  const diffs = Object.entries(resolutionOptions).map(([id, resolution]) => {
    const aspectDiff =
      Math.abs(resolution.width / resolution.height - targetAspect) /
      targetAspect;
    const resolutionDiff =
      Math.abs(resolution.width * resolution.height - targetResolution) /
      targetResolution;
    return { id, totalDiff: aspectDiff + resolutionDiff };
  });

  for (const { id, totalDiff } of diffs) {
    if (totalDiff < minTotalDiff) {
      minTotalDiff = totalDiff;
      resolutionId = id;
    }
  }

  return resolutionId;
}

/**
 * Generates an image in SD WebUI API using the provided prompt and configuration settings.
 *
 * @param {string} positivePrompt - The main instruction used to guide the image generation.
 * @param {string} negativePrompt - The instruction used to restrict the image generation.
 * @param {AbortSignal} signal - An AbortSignal object that can be used to cancel the request.
 *  @param {number} generationType - The type of image generation to perform.
 *  @returns {Promise<{format: string, data: string}>} - A promise that resolves when the image generation and processing are complete.
 */
interface GenerateAutoImageParams {
  characters?: any;
  options?: any;
  positivePrompt?: string;
  negativePrompt?: any;
  signal?: any;
  generationType?: any;
}

async function generateAutoImage({
  characters,
  options,
  positivePrompt,
  negativePrompt,
  signal,
  generationType,
}: GenerateAutoImageParams = {}) {
  // Function implementation
  //const { key, settings } = keyCheck();
  /*const isValidVae =
    config.sd.vae &&
    !["N/A", config.sd.placeholderVae].includes(config.sd.vae);
  if (characters[key].cn.fid.enable) {
    positivePrompt =
      `<lora:${characters[key].cn.fid.lora}:1>, ${positivePrompt}`;
  }*/
  const postBody = {
    prompt: positivePrompt,
    negative_prompt: negativePrompt, //was extension_settings.sd.negative_prompt...
    /** Fuck knows what these are */
    n_iter: 1,
    s_churn: 0.0,
    s_min_uncond: 0.0,
    s_noise: 1.0,
    s_tmax: null,
    s_tmin: 0.0,
    //--------------------------------
    sampler_name: characters[key][settings.sampler],
    scheduler:
      characters[key][settings.scheduler] ?? "Automatic",
    steps: characters[key][settings.steps] ?? 20,
    override_settings: {
      CLIP_stop_at_last_layers:
        characters[key][settings.clipskip] ?? 1,
      sd_model_checkpoint:
        characters[key][settings.model] ?? undefined,
    },
    override_settings_restore_afterwards: false, //meh, just leave them as is. Probably using the same character anyway
    cfg_scale: Number(characters[key][settings.scale]),
    width: options.width ?? 512,
    height: options.height ?? 512,
    restore_faces: !!options.restore_faces ?? false,
    enable_hr: !!options.enable_hr ?? false,
    hr_upscaler: options.hr_upscaler ?? "none",
    hr_scale: options.hr_scale ?? 0,
    denoising_strength: options.denoising_strength,
    hr_second_pass_steps: options.hr_second_pass_steps,
    seed:
      options.character[key][settings.seed] >= 0
        ? options.character[key][settings.seed]
        : "-1",
    // Ensure generated img is saved to disk
    save_images: true,
    send_images: true,
    do_not_save_grid: false,
    do_not_save_samples: false,
  };
  if (options.character[key][settings.vae]) {
    postBody.override_settings.sd_vae =
      options.character[key][settings.vae];
  }
  const AOScripts =
    (await addAlwaysOnScripts(
      extension_settings,
      key,
      settings,
      generationType,
      generationMode,
      expressYourself
    )) || {};
  console.log("WebUI request", {
    ...postBody,
    ...AOScripts,
  });
  console.log("EXTENSION SETTINGS SD", options);

  const result = await fetch("/api/sd/generate", {
    method: "POST",
    headers: getRequestHeaders(),
    signal: signal,
    body: JSON.stringify({
      ...postBody,
      ...AOScripts,
    }),
  });
