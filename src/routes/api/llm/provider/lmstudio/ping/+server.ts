import { resp } from "$utilities/apiHelper";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const baseUrl = url.searchParams.get("baseUrl");

  if (!baseUrl) {
    return new Response(JSON.stringify({ error: "Base URL is missing" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(`${baseUrl}/v1/models`);
    if (!response.ok) {
      return resp({ error: "Failed to connect to LmStudio, Make sure you are running the LmStudio server and the url is correct." }, response.status);
    }
    return resp({ content: "LmStudio connection successful" }, 200);
  } catch (error) {
    return resp(error, 500);
  }
};
