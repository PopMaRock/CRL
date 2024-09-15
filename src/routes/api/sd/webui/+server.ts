import { resp } from "$utilities/apiHelper";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const baseUrl = body.url;
  const action = body.action || "defaultAction"; // Replace 'defaultAction' with your default action if needed
  const opts = body.opts || {}; // Additional options passed in the request body

  const url = new URL(baseUrl);
  let method = "GET";
  let postProcess: (data: any) => any = (data) => data;
  switch (action) {
    case "ping":
      url.pathname = "/sdapi/v1/options";
      break;
    case "get-model": //singular - get currently loaded model
      url.pathname = "/sdapi/v1/options";
      postProcess = async (data) => {
        return data.sd_model_checkpoint;
      };
      break;
    case "set-model":
      url.pathname = "/sdapi/v1/progress";
      //TODO: Implement this
      break;
    case "get-models": //plural - get all models
      url.pathname = "/sdapi/v1/sd-models";
      postProcess = async (data) => {
        return data.map((x: any) => ({ value: x.title, text: x.title }));
      };
      break;
    case "get-samplers":
      url.pathname = "/sdapi/v1/samplers";
      postProcess = async (data) => {
        return data.map((x: { name: any }) => x.name);
      };
      break;
    case "get-upscalers":
      url.pathname = "/sdapi/v1/upscalers";
      postProcess = async (data) => {
        return data.map((x: { name: any }) => x.name);
      };
      break;
    case "get-schedulers":
      url.pathname = "/sdapi/v1/schedulers";
      postProcess = async (data) => {
        return data.map((x: { name: any }) => x.name);
      };
      break;
    case "get-vaes":
      url.pathname = "/sdapi/v1/sd-vae";
      postProcess = async (data) => {
        return data.map((x: { name: any }) => x.name);
      };
      break;
    case "scripts":
      url.pathname = "/sdapi/v1/scripts";
      break;
    case "get-loras": //working
      url.pathname = "/sdapi/v1/loras";
      break;
    case "get-ct-models": //working
      url.pathname = "/controlnet/model_list";
      break;
    case "get-ct-modules": //working
      url.pathname = "/controlnet/module_list";
      break;
    case "get-ct-types": //Working - better than get modules and get models
      url.pathname = "/controlnet/control_types";
      break;
    case "interrupt": //working - returns nothing.
      url.pathname = "/sdapi/v1/interrupt";
      method = "POST";
      break;
    case "interrogate": //untested.
      url.pathname = "/sdapi/v1/interrogate";
      method = "POST";
      break;
    default:
      throw new Error("Unknown action");
  }
  try {
    //it's a request, init bruv.
    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...opts.headers // Include any additional headers from opts
      },
      ...(method !== 'GET' && { body: JSON.stringify({ ...opts.body }) }) // Conditionally include body
    };
    const result = await fetch(url.toString(), fetchOptions);
    if (result.ok) {
      let data = await result.json();
      data = await postProcess(data);
      return resp(data, 200);
    }
    throw new Error("Failed to fetch data");
  } catch (error) {
    console.error(error);
    return resp(error, 500);
  }
};
