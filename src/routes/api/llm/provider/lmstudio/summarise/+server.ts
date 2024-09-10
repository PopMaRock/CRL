import { resp, stripConversation } from "$utilities/apiHelper";
import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Post accepts a JSON object of text, contextLimit
    let { payload, contextLimit = 4096 } = await request.json();

    if (!payload) {
      return resp({ error: "Bad Request: `text` is required" }, 400);
    }
    //payload is an array of objects. Text should be built from the content property of each object.
    let text = "";
    for (let i = 0; i < payload.length; i++) {
      text += `\n${payload[i].content} `;
    }
    text = await stripConversation(text.trim(), contextLimit);
    

    //CHEAT - no writing it again, just call rawChat - because we can!
    const prompt =
      "You are an AI dungeon master that summarizes any kind of roleplaying game content. The provided story history includes key plot points, world information, dialogue and character actions. Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.";
    const baseUrl = new URL(request.url).origin;
    const response = await fetch(
      `${baseUrl}/api/llm/provider/lmstudio/rawchat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "",
          systemPrompt: prompt,
          userMessage: `Story history: ${text}\r\n Distill the above story history into a single summary message. Respond in 250 words or less. Include as many specific details as you can. Only respond with the summary message.`,
          settings: {
            generateNum: 400,
            temperature: 0.6,
            topP: 0.9,
            frequencyPenalty: 0.5,
            presencePenalty: 0.5,
            streaming: false,
          },
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Return the result
    return resp({ data }, 200);
  } catch (error) {
    console.error("Error in POST /api/summarize: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};


