//https://colab.research.google.com/github/finetuneanon/gpt-neo_dungeon/blob/master/gpt-neo_dungeon.ipynb

//temperature
export const settings = {
temperature: 0.4,
top_P: 0.9,
top_k: 60,
token_number: 40,
repetition_penalty: 2.5,
repetition_penalty_range: 512,
repetition_penalty_slope: 3.33,
tail_free_sampling: 0.95,
};

//System prompt
//Potential: https://deckofdmthings.wordpress.com/2023/03/05/the-prompt-that-makes-chat-gpt-a-dungeon-master/
//Another: https://www.rpgprompts.com/post/dungeons-dragons-chatgpt-prompt

/**
You are an AI dungeon master that provides any kind of roleplaying game content.

Instructions:
- Be specific, descriptive, and creative.
- Avoid repetition and avoid summarization.
- Generally use second person (like this: 'He looks at you.'). But use third person if that's what the story seems to follow.
- Never decide or write for the user. If the input ends mid sentence, continue where it left off.
- > tokens mean a character action attempt. You should describe what happens when the player attempts that action. Generating '###' is forbidden.
 */

//SPRING DRAGON: https://huggingface.co/TheBloke/Spring-Dragon-GGUF

/*
Notes -
Prefix responses with 'you'. AI Dungeon did this automatically
*/


/*****
 FOR SCENE DESCRIPTIONS TO GENERATE DYNABACKGROUND:
 After generating the next part of the story, please provide a brief description of the current scene in three layers:
1. Background (e.g., sky, distant elements)
2. Middleground (e.g., landscape, buildings)
3. Foreground (e.g., characters, nearby objects, atmospheric effects)

Each layer should be described in 3-5 words.
 */

