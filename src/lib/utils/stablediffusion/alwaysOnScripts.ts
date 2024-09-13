export function freeU(
  extensionSettings: {
    sd: { character: { [x: string]: { [x: string]: any } }; source: any };
  },
  key: string | number
) {
  console.log("FreeU on!");
  switch (extensionSettings.sd.character[key].freeU) {
    //recommended settings based on: https://stable-diffusion-art.com/freeu/
    case "0": //SDXL
    case "1": //1.4
    case "3": //2.1
      return {
        args: [
          true,
          1.3, //B1
          1.4, //B2
          0.9, //S1
          0.2, //S2
        ],
      };
    //SD 1.5
    case "2":
      return {
        args: [true, 1.3, 1.4, 0.99, 0.2],
      };
  }
}
function adetailer(
  extensionSettings: { sd: { character: { [x: string]: { [x: string]: any; }; }; }; },
  key: string | number,
  settings: { ad: { adetailer_models: string | number; adetailer_weight: string | number; }; expression: string | number; },
  generationType: any,
  generationMode: { BACKGROUND: any; },
  expressYourself: { [x: string]: any; }
) {
  //ao_scripts.alwayson_scripts.ADetailer
  let rtn = null;
  console.log("ADetailer on!");
  rtn = {
    args: extensionSettings.sd.character[key].ad[
      settings.ad.adetailer_models
    ].map((model: string | string[]) => ({
      ad_model: model,
      ad_confidence:
        extensionSettings.sd.character[key].ad[
          settings.ad.adetailer_weight
        ] ?? 0.3,
      ad_restore_face: false,
      ad_controlnet_model: "None",
      ad_controlnet_module: "None",
      ad_controlnet_weight: 1.0,
      ad_controlnet_guidance_start: 0.0,
      ad_controlnet_guidance_end: 1.0,
      ad_prompt: model.includes("face")
        ? expressYourself[
            extensionSettings.sd.character[key][settings.expression] ??
              "neutral"
          ]
        : model.includes("hands")
        ? "five fingers"
        : "high quality",
      ad_negative_prompt: model.includes("hand")
        ? "deformed hand, extra_fingers,bad fingers,missing fingers,fewer digits,extra digit,liquid fingers"
        : model.includes("face")
        ? "deformed face,deformed eyes,ugly,blurry,bad eyes"
        : model.includes("person")
        ? "bad anatomy,deformed mutated disfigured,missing arms,extra_arms"
        : "bad quality",
    })),
  };

  //if it's a background, overwrite the model to set to yolov8x-world.pt
  if (generationType === generationMode.BACKGROUND)
    rtn.args = [
      {
        ad_model: "yolov8x-world.pt",
        ad_confidence: 0.3,
        //ad_weight: 1.0,
        //ad_guidance_start: 0.0,
        //ad_guidance_end: 1.0,
        //ad_module: "None",
      },
    ];
  return rtn;
}
function reference(
  extension_settings: { sd: { character: { [x: string]: { [x: string]: { [x: string]: { [x: string]: any; }; }; }; }; }; },
  key: string | number,
  settings: { cn: { attachTo: string | number; prefer: string | number; pixelperfect: string | number; weight: string | number; }; },
  generationType: { toString: () => any; },
  generationMode: { BACKGROUND: any; },
  base64Image: unknown
) {
  let rtn = null;
  if (
    extension_settings.sd.character[key].cn.ref[
      settings.cn.attachTo
    ].includes(generationType.toString()) &&
    extension_settings.sd.character[key].cn.ref.enable === true
  ) {
    if (!base64Image) return null; //nae image
    console.log("controlnet Reference is on!");
    rtn = {
      //batch_image_dir: "",
      //batch_input_gallery: null,
      //batch_mask_dir: "",
      //batch_mask_gallery: null,
      control_mode:
        extension_settings.sd.character[key].cn.ref[settings.cn.prefer], // "Balanced", "My prompt is more important", "controlnet is more important"
      enabled: true,
      //generated_image: null,
      guidance_end: 1.0,
      guidance_start: 0.0,
      hr_option: "Low res only",
      image: base64Image,
      //image_fg: null,
      //input_mode: "simple",
      //mask_image: null,
      //mask_image_fg: null,
      model: "None",
      module: "reference_only",
      pixel_perfect:
        extension_settings.sd.character[key].cn.ref[
          settings.cn.pixelperfect
        ],
      //processor_res: 0.5,
      resize_mode: "Crop and Resize",
      //save_detected_map: false,
      threshold_a: 0.5,
      threshold_b: 0.5,
      //use_preview_as_input: false,
      weight:
        Number(
          extension_settings.sd.character[key].cn.ref[settings.cn.weight]
        ) ?? 0.5,
    };
    //if it's a background, overwrite
    if (generationType === generationMode.BACKGROUND) {
      //maybe add reference in the future for background. maybe not
    }
    return rtn;
  }
}
function faceid(extension_settings: { sd: { character: { [x: string]: { [x: string]: { [x: string]: { [x: string]: any; }; }; }; }; }; }, key: string | number, settings: { cn: { model: string | number; module: string | number; pixelperfect: string | number; weight: string | number; }; }, base64Image: unknown) {
  /*
            controlnet IPAdapter -- Should only use reference or ipadapter faceid - not both!
            faceID ip settings:---
            weight: 0.55
            start 0.7
            end: 1.0
            /*
            positive prompt add: <lora:ip-adapter-faceid-plusv2_sdxl_lora:0.6>
            ----------------------
            */
  return {
    //batch_image_dir: "",
    //batch_input_gallery: null,
    //batch_mask_dir: "",
    //batch_mask_gallery: null,
    control_mode: "Balanced",
    enabled: true,
    //generated_image: null,
    guidance_end: 1.0,
    guidance_start: 0.0,
    hr_option: "Low res only",
    image: base64Image,
    //image_fg: null,
    //input_mode: "simple",
    //mask_image: null,
    //mask_image_fg: null,
    model: extension_settings.sd.character[key].cn.fid[settings.cn.model],
    module:
      extension_settings.sd.character[key].cn.fid[settings.cn.module],
    pixel_perfect:
      extension_settings.sd.character[key].cn.fid[
        settings.cn.pixelperfect
      ],
    //processor_res: 1152,
    resize_mode: "Resize and Fill", // "Just Resize", "Crop and Resize", "Resize and Fill"
    //save_detected_map: false,
    threshold_a: 0.5,
    threshold_b: 0.5,
    //use_preview_as_input: false,
    weight:
      Number(
        extension_settings.sd.character[key].cn.fid[settings.cn.weight]
      ) ?? 0.5,
  };
}
/** Build AlwaysOnScripts --------------
 * Downloads the image and converts it to a base64 string, then returns an object with the necessary arguments for the controlnet script.
 * @async
 * @function addAlwaysOnScripts
 * @returns Promise{any} An object with the necessary arguments for the controlnet script, or false if an error occurs.
 */
export async function addAlwaysOnScripts(
  extension_settings: { sd: any; },
  key: string | number,
  settings: { expression: string | number; cn: { inputRef: string | number; attachTo: string | number; }; ao: { manual_ao_mode: string | number; ao_override: string | number; }; },
  generationType: { toString: () => any; },
  generationMode: any,
  expressYourself: { [x: string]: any; }
) {
  // Get character filename
  let base64Image = null;
  let ao_scripts = { alwayson_scripts: {} };
  console.log(
    "AddAlwaysOnScripts: expression",
    expressYourself[
      extension_settings.sd.character[key][settings.expression] ?? "neutral"
    ]
  );
  //Get base64 image
  try {
    base64Image = await getImageForAOScripts(
      extension_settings.sd.character[key].cn.ref[settings.cn.inputRef]
    );
  } catch (error) {
    console.error(error);
  }
  //--------------------------------------------------------------------------------
  //OVERRIDE AO SCRIPTS AND ALLOW USER TO SEND WHATEVER THE FUCK THEY WANT
  //--------------------------------------------------------------------------------
  if (
    extension_settings.sd.character[key].ao[settings.ao.manual_ao_mode] ===
    true
  ) {
    ao_scripts.alwayson_scripts =
      extension_settings.sd.character[key].ao[settings.ao.ao_override];
    // Replace every occurrence of {{base64Image}} in ao_scripts.alwayson_scripts
    ao_scripts.alwayson_scripts = ao_scripts.alwayson_scripts.replace(
      /{{base64Image}}/g,
      base64Image
    );
    return ao_scripts; //done. Nothing more will happen.
  }
  //######################################################################
  //ELSE, NO OVERWRITE SO CARRY ON....
  //ADetailer--------------------------------------------------------
  if (extension_settings.sd.character[key].ad?.adetailer_mode === true) {
    const adetailerSettings = adetailer(
      extension_settings,
      key,
      settings,
      generationType,
      generationMode,
      expressYourself
    );
    if (adetailerSettings)
      ao_scripts.alwayson_scripts.ADetailer = adetailerSettings;
  }
  //uFree-----------------------------------------------------------
  if (extension_settings.sd.character[key].freeU) {
    const freeuSettings = freeU(extension_settings, key);
    if (freeuSettings)
      //Assign correct alwayson script based on source
     ao_scripts.alwayson_scripts["freeu integrated"] = freeuSettings;
  }
  //CONTROLNET-----------------------------------------------------------
  if (extension_settings.sd.character[key].cn.mode === true) {
    ao_scripts.alwayson_scripts.controlnet = { args: [] };
    //Reference
    if (
      extension_settings.sd.character[key].cn.ref[
        settings.cn.attachTo
      ].includes(generationType.toString()) &&
      extension_settings.sd.character[key].cn.ref.enable === true
    ) {
      const referenceSettings = reference(
        extension_settings,
        key,
        settings,
        generationType,
        generationMode,
        base64Image
      );
      if (referenceSettings)
        ao_scripts.alwayson_scripts.controlnet.args.push(referenceSettings);
    }
    //FaceID
    if (
      extension_settings.sd.character[key].cn.fid[
        settings.cn.attachTo
      ].includes(generationType.toString()) &&
      extension_settings.sd.character[key].cn.fid.enable === true
    ) {
      const faceidSettings = faceid(
        extension_settings,
        key,
        settings,
        base64Image
      );
      if (faceidSettings)
        ao_scripts.alwayson_scripts.controlnet.args.push(faceidSettings);
      //MODIFY THE ADETAILER FACE AS IT'LL BE TOO STRONG OTHERWISE
      if (
        Object.prototype.hasOwnProperty.call(
          ao_scripts.alwayson_scripts,
          "ADetailer"
        )
      ) {
        // Find the index of the item that has a model name that includes face
        let index = ao_scripts.alwayson_scripts.adetailer.args.findIndex((x: { ad_model: string | string[]; }) =>
          x.ad_model.includes("face")
        );

        if (index !== -1) {
          // Copy the item
          let faceItem = {
            ...ao_scripts.alwayson_scripts.adetailer.args[index],
          };
          faceItem.ad_inpaint_only_masked = false;
          /*
                      faceItem.ad_mask_max_ratio = 0.55;
                      //Modify the item to add more elements to the arg
                      faceItem.ad_controlnet_model = "Passthrough";
                      faceItem.ad_controlnet_guidance_start = 0;
                      faceItem.ad_controlnet_guidance_end = 0.3;
                      faceItem.ad_controlnet_weight = 0.3;
                      faceItem.ad_mask_merge_invert = "Merge and Invert";
                      */
          // Replace the original item in the array
          ao_scripts.alwayson_scripts.adetailer.args.splice(index, 1, faceItem);
        }
      }
    }
  }
  return ao_scripts;
}
export async function getImageForAOScripts(inputRef: any) {
  let srcValue = "";
  const context = getContext();
  //INPUTREF ----
  try {
    let user = null;
    switch (inputRef) {
      case "char":
        srcValue =
          "/characters/" + context.characters[context.characterId].avatar;
        break;
      //not really tested this one cause who wants to see their own face mangled by SD?
      case "user":
        console.log("user");
        //will slice out 10 entries then look for user in the chat log
        //probably a better way to do this....
        user = $(context.chat)
          .slice(0, 10)
          .filter(function () {
            return this.is_user === true;
          });
        srcValue = user[0].avatar ?? null;
        if (!srcValue) {
          srcValue = $("div[is_user='true'] .avatar img").attr("src");
          if (!srcValue) return false;
        }

        break;
      //FIXME: Probably a better way to do this...
      //FIXME: as even if ext is known, it's a guess what the fuck it is.
      case "char-expression":
        console.log("char-expression");
        console.log("In expression");
        srcValue = $("#expression-image").attr("src");
        if (!srcValue) {
          srcValue =
            "characters/" + context.characters[context.characterId].avatar;
        }
        break;
    }
  } catch (e) {
    console.error(e);
  }

  if (!srcValue) {
    console.warn("No srcValue for controlnet...");
    return false;
  }
  //If nae forward flash, add it. Cause eh need it.
  if (!srcValue.startsWith("/")) {
    srcValue = "/" + srcValue;
  }
  //--------------
  //--------------
  // Construct the full URL
  const url = window.location.origin + srcValue;
  console.log("read this image: ", url);
  // Download the image and convert it to a base64 string
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("Error reading image for controlnet", url);
      return false;
    }
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return await new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  } catch (e) {
    console.error(e);
  }
}
