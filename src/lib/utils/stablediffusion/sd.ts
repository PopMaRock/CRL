import { resolutionOptions } from "./sdConstants";

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
async function generateAutoImage(
  positivePrompt,
  negativePrompt,
  signal,
  generationType
) {
  const { key, settings } = keyCheck();
  const isValidVae =
    extension_settings.sd.vae &&
    !["N/A", placeholderVae].includes(extension_settings.sd.vae);
  if (extension_settings.sd.character[key]["cn"]["fid"].enable) {
    positivePrompt =
      "<lora:" +
      extension_settings.sd.character[key]["cn"]["fid"]["lora"] +
      ":1>, " +
      positivePrompt;
  }
  const postBody = {
    ...getSdRequestBody(),
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
    sampler_name: extension_settings.sd.character[key][settings.sampler],
    scheduler:
      extension_settings.sd.character[key][settings.scheduler] ?? "Automatic",
    steps: extension_settings.sd.character[key][settings.steps] ?? 20,
    override_settings: {
      CLIP_stop_at_last_layers:
        extension_settings.sd.character[key][settings.clipskip] ?? 1,
      sd_model_checkpoint:
        extension_settings.sd.character[key][settings.model] ?? undefined,
    },
    override_settings_restore_afterwards: false, //meh, just leave them as is. Probably using the same character anyway
    cfg_scale: Number(extension_settings.sd.character[key][settings.scale]),
    width: extension_settings.sd.width ?? 512,
    height: extension_settings.sd.height ?? 512,
    restore_faces: !!extension_settings.sd.restore_faces ?? false,
    enable_hr: !!extension_settings.sd.enable_hr ?? false,
    hr_upscaler: extension_settings.sd.hr_upscaler ?? "none",
    hr_scale: extension_settings.sd.hr_scale ?? 0,
    denoising_strength: extension_settings.sd.denoising_strength,
    hr_second_pass_steps: extension_settings.sd.hr_second_pass_steps,
    seed:
      extension_settings.sd.character[key][settings.seed] >= 0
        ? extension_settings.sd.character[key][settings.seed]
        : "-1",
    // Ensure generated img is saved to disk
    save_images: true,
    send_images: true,
    do_not_save_grid: false,
    do_not_save_samples: false,
  };
  if (extension_settings.sd.character[key][settings.vae]) {
    postBody.override_settings.sd_vae =
      extension_settings.sd.character[key][settings.vae];
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
  console.log("EXTENSION SETTINGS SD", extension_settings.sd);

  const result = await fetch("/api/sd/generate", {
    method: "POST",
    headers: getRequestHeaders(),
    signal: signal,
    body: JSON.stringify({
      ...postBody,
      ...AOScripts,
    }),
  });
