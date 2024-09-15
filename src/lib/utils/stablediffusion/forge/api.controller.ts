import { browser } from "$app/environment";
import { toastr } from "$utilities/toastr";

export async function getControlNetModules() {
  //$("#sd_character_controlnet_fid_module").empty();
  try {
    const result = await callSdApi(getSdRequestBody("get-ct-modules"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data.module_list;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getControlNetModels() {
  // $("#sd_character_controlnet_fid_model").empty();
  try {
    const result = await callSdApi(getSdRequestBody("get-ct-models"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data.model_list;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getControlNetTypes() {
  try {
    const result = await callSdApi(getSdRequestBody("get-ct-types"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function interruptForge() {
  try {
    const result = await callSdApi(getSdRequestBody("interrupt"));
    if (!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getForgeScripts() {
  try {
    const result = await callSdApi(getSdRequestBody("scripts"));
    if (!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getLoras(ipadapterOnly = true) {
  //$("#sd_character_controlnet_fid_lora").empty();
  try {
    const result = await callSdApi(getSdRequestBody("get-loras"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    const data = await result.data;
    console.log("LORAS", data);
    if (ipadapterOnly) {
      //filter through the data and build a new array where name includes 'ip-adapter'
      return data.filter((item: { name: string | string[] }) =>
        item.name.includes("ip-adapter")
      );
    }
    return data.module_list;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getForgeVaes() {
  try {
    const result = await callSdApi(getSdRequestBody("get-vaes"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    const data = result.data;
    Array.isArray(data) && data.unshift("Automatic");
    return data;
  } catch (error) {
    return ["N/A"];
  }
}
export async function getForgeSamplers() {
  try {
    const result = await callSdApi(getSdRequestBody("get-samplers"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getForgeModels() {
  let result = null;

  try {
    const currentModel = await getForgeModel();

    if (currentModel) {
      //extension_settings.sd.model = currentModel;
    }
    try {
      result = await callSdApi(getSdRequestBody("get-models"));
      if(!result) throw new Error("No result returned from SD WebUI.");
      if (!result.success) {
        throw new Error("SD WebUI returned an error.");
      }
    } catch (error) {
      if (result?.data) {
        console.error(await result.data);
      } else {
        console.error("Result is null.");
      }
    }
  } catch (error) {
    return [];
  }
  const upscalers = await getForgeUpscalers();
  /*
  if (Array.isArray(upscalers) && upscalers.length > 0) {
    //$("#sd_hr_upscaler").empty();

    for (const upscaler of upscalers) {
      const option = document.createElement("option");
      option.innerText = upscaler;
      option.value = upscaler;
      option.selected = upscaler === sd.hr_upscaler;
    }
  }
  let data = [];
  if (result.success) {
    data = await result.json();
  }*/
  //return data;
}
export async function getForgeSchedulers() {
  try {
    const result = await callSdApi(getSdRequestBody("get-schedulers"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data;
  } catch (error) {
    console.error(error);
    return ["N/A"];
  }
}
export async function getForgeUpscalers() {
  try {
    const result = await callSdApi(getSdRequestBody("get-upscalers"));
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    return result.data;
  } catch (error) {
    console.error(error);
    return ["N/A"];
  }
}
export async function updateForgeModel(model: string) {
  try {
    const result = await callSdApi(
      getSdRequestBody("set-model", {
        model: model,
      })
    );
    if(!result) throw new Error("No result returned from SD WebUI.");
    if (!result.success) {
      throw new Error("SD WebUI returned an error.");
    }
    console.log("Model successfully updated on SD WebUI remote.");
  } catch (error) {
    console.error(error);
    toastr({
      type: "error",
      message: `Could not update SD WebUI model: ${error}`,
    });
  }
}
export async function validateForgeUrl() {
  try {
    const result = await callSdApi(getSdRequestBody("ping"));
    if (!result?.success) throw new Error("SD WebUI API returned an error.");
    toastr({ message: "SD WebUI API connected.", type: "success" });
    return true;
  } catch (error: any) {
    console.error(error);
    toastr({
      message: `Could not validate SD WebUI API:\n ${error}`,
      type: "error",
    });
    return false;
  }
}
export async function getForgeModel() {
  try {
    return await callSdApi(getSdRequestBody("get-model"));
  } catch (error) {
    return { error: true };
  }
}
function getSdRequestBody(action = "ping", opts?: any) {
  return {
    url: "http://127.0.0.1:7860",
    auth: null,
    action: action,
    ...opts,
  };
}
async function callSdApi(body: any) {
  if (browser) {
    try {
      const result = await fetch("/api/sd/webui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!result.ok) {
        throw new Error("Error making SD WebUI call.");
      }
      const data = await result.json();
      if(!data || data?.error) throw new Error(data?.error);
      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }
}
