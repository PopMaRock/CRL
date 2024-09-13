/* eslint-disable comma-dangle */
/* eslint-disable quotes */

export async function pingServerPlugin() {
  try {
    const result = await fetch("/api/plugins/stwebui/ping", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getControlNetModules() {
  $("#sd_character_controlnet_fid_module").empty();
  try {
    const result = await fetch("/api/plugins/stwebui/controlnet/modules_list", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }
    const data = await result.json();
    return data.module_list;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getControlNetModels() {
  $("#sd_character_controlnet_fid_model").empty();
  try {
    const result = await fetch("/api/plugins/stwebui/controlnet/model_list", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }
    const data = await result.json();
    return data.model_list;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getLoras(ipadapterOnly = true) {
  $("#sd_character_controlnet_fid_lora").empty();
  try {
    const result = await fetch("/api/plugins/stwebui/loras", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }
    const data = await result.json();
    if (ipadapterOnly) {
      //filter through the data and build a new array where name includes 'ip-adapter'
      return data.filter((item) => item.name.includes("ip-adapter"));
    } else {
      return data.module_list;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function loadAutoVaes() {
  if (!extension_settings.sd.auto_url) {
    return ["N/A"];
  }

  try {
    const result = await fetch("/api/plugins/stwebui/vaes", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }

    const data = await result.json();
    Array.isArray(data) && data.unshift(placeholderVae);
    return data;
  } catch (error) {
    return ["N/A"];
  }
}
export async function loadAutoSamplers() {
  if (!extension_settings.sd.auto_url) {
    return [];
  }

  try {
    const result = await fetch("/api/sd/samplers", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return [];
  }
}
export async function loadAutoModels() {
  let result = null;
  if (!extension_settings.sd.auto_url) {
    return [];
  }

  try {
    const currentModel = await getAutoRemoteModel();

    if (currentModel) {
      extension_settings.sd.model = currentModel;
    }
    try {
      result = await fetch("/api/sd/models", {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify(getSdRequestBody()),
      });

      if (!result.ok) {
        throw new Error("SD WebUI returned an error.");
      }
    } catch (error) {
      console.error(await result.json());
    }
  } catch (error) {
    return [];
  }
  const upscalers = await getAutoRemoteUpscalers();

  if (Array.isArray(upscalers) && upscalers.length > 0) {
    $("#sd_hr_upscaler").empty();

    for (const upscaler of upscalers) {
      const option = document.createElement("option");
      option.innerText = upscaler;
      option.value = upscaler;
      option.selected = upscaler === extension_settings.sd.hr_upscaler;
      $("#sd_hr_upscaler").append(option);
    }
  }
  let data = [];
  if (result.ok) {
    data = await result.json();
  }
  return data;
}
export async function getAutoRemoteSchedulers() {
  try {
    const result = await fetch("/api/sd/schedulers", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }

    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
    return ["N/A"];
  }
}
export async function getAutoRemoteUpscalers() {
  try {
    const result = await fetch("/api/sd/upscalers", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }

    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
    return [extension_settings.sd.hr_upscaler];
  }
}
export async function updateAutoRemoteModel() {
  try {
    const result = await fetch("/api/sd/set-model", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify({
        ...getSdRequestBody(),
        model: extension_settings.sd.model,
      }),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }

    console.log("Model successfully updated on SD WebUI remote.");
  } catch (error) {
    console.error(error);
    toastr.error(`Could not update SD WebUI model: ${error.message}`);
  }
}
export async function updateExtrasRemoteModel() {
  const url = new URL(getApiUrl());
  url.pathname = "/api/image/model";
  const getCurrentModelResult = await doExtrasFetch(url, {
    method: "POST",
    body: JSON.stringify({ model: extension_settings.sd.model }),
  });

  if (getCurrentModelResult.ok) {
    console.log("Model successfully updated on SD remote.");
  }
}
export async function loadExtrasSamplers() {
  if (!modules.includes("sd")) {
    return [];
  }

  const url = new URL(getApiUrl());
  url.pathname = "/api/image/samplers";
  const result = await doExtrasFetch(url);

  if (result.ok) {
    const data = await result.json();
    return data.samplers;
  }

  return [];
}
export function getSdRequestBody() {
  switch (extension_settings.sd.source) {
    case sources.auto:
    case sources.forge:
      return {
        url: extension_settings.sd.auto_url,
        auth: extension_settings.sd.auto_auth,
      };
    default:
      throw new Error("Invalid SD source.");
  }
}
export async function validateAutoUrl() {
  try {
    if (!extension_settings.sd.auto_url) {
      toastr.error("URL is not set.");
      return false;
    }

    const result = await fetch("/api/sd/ping", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      toastr.error("SD WebUI returned an error.");
      return false;
    }
    toastr.success("SD WebUI API connected.");
    return true;
  } catch (error) {
    toastr.error(`Could not validate SD WebUI API: ${error.message}`);
    return false;
  }
}
export async function loadExtrasModels() {
  if (!modules.includes("sd")) {
    return [];
  }

  const url = new URL(getApiUrl());
  url.pathname = "/api/image/model";
  const getCurrentModelResult = await doExtrasFetch(url);

  if (getCurrentModelResult.ok) {
    const data = await getCurrentModelResult.json();
    extension_settings.sd.model = data.model;
  }

  url.pathname = "/api/image/models";
  const getModelsResult = await doExtrasFetch(url);

  if (getModelsResult.ok) {
    const data = await getModelsResult.json();
    const view_models = data.models.map((x) => ({ value: x, text: x }));
    return view_models;
  }

  return [];
}
export async function getAutoRemoteModel() {
  try {
    const result = await fetch("/api/sd/get-model", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(getSdRequestBody()),
    });

    if (!result.ok) {
      throw new Error("SD WebUI returned an error.");
    }

    const data = await result.text();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
