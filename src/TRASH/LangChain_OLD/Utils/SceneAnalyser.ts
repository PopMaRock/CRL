export function extractSceneKeywords(storyText:string) {
    // Assuming the LLM provides the scene description in a specific format
    const sceneDescriptionRegex = /Scene Description:\s*Background: (.*?)\s*Middleground: (.*?)\s*Foreground: (.*)/i;
    const match = storyText.match(sceneDescriptionRegex);
  
    if (match) {
      const [, background, middleground, foreground] = match;
      
      return {
        background: background.split(',').map(word => word.trim().toLowerCase()),
        middleground: middleground.split(',').map(word => word.trim().toLowerCase()),
        foreground: foreground.split(',').map(word => word.trim().toLowerCase())
      };
    }
  
    // If no structured description is found, fall back to keyword extraction
    const keywords = storyText.toLowerCase().match(/\b(\w+)\b/g)??[];
    const relevantKeywords = keywords.filter(word => 
      ['sky', 'cloud', 'sun', 'moon', 'star', 'tree', 'forest', 'mountain', 'river', 'character', 'mist', 'fog'].includes(word)
    );
  
    return {
      background: relevantKeywords.filter(word => ['sky', 'cloud', 'sun', 'moon', 'star'].includes(word)),
      middleground: relevantKeywords.filter(word => ['tree', 'forest', 'mountain', 'river'].includes(word)),
      foreground: relevantKeywords.filter(word => ['character', 'mist', 'fog'].includes(word))
    };
  }
  /*
  //You can use this function in your Svelte component like this:
  import { extractSceneKeywords } from './SceneAnalyser';

  let storyText = ''; // This would be populated with the LLM response
  let sceneKeywords = {};

  $: {
    sceneKeywords = extractSceneKeywords(storyText);
  }
  */
import DynaBackgroundKeywords from "./DynaBackground";
  
import { OpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Tool } from "langchain/tools";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PromptTemplate } from "langchain/prompts";

// Scene keywords (from previous artifact)
const sceneKeywords = {
  background: ["clear sky", "cloudy", "stormy", "starry night", "aurora", "eclipse", "sun", "moon", "planets", "comets", "mountains", "valleys", "desert dunes", "ocean horizon", "volcanoes", "glaciers", "canyons", "floating islands", "celestial bodies", "magical auroras", "portals", "rifts in space"],
  middleground: ["forest", "jungle", "savanna", "tundra", "swamp", "hills", "cliffs", "beaches", "ice fields", "rivers", "lakes", "waterfalls", "hot springs", "ocean waves", "geysers", "whirlpools", "castles", "towers", "ruins", "temples", "bridges", "villages", "cities", "ports", "fortresses", "trees", "giant mushrooms", "alien flora", "crop fields", "gardens", "magical groves"],
  foreground: ["adventurers", "monsters", "magical beings", "wildlife", "domestic animals", "mythical beasts", "campfire", "tents", "vehicles", "rocks", "fallen trees", "bushes", "treasure chests", "magical artifacts", "portals", "doors", "gates", "traps", "puzzles", "mist", "fog", "smoke", "dust", "magic sparks", "fireflies", "falling leaves", "snow", "torches", "lanterns", "glowing crystals", "magical auras", "bioluminescent plants"]
};

// Custom tool for scene keyword generation
class SceneKeywordTool extends Tool {
  name: string;
  description: string;
  constructor(llm:any) {
    super();
    this.name = "SceneKeywordGeneration";
    this.description = "Generates scene keywords based on a story context";
    this.llm = llm;
  }

  async _call(input: string) {
    const prompt = PromptTemplate.fromTemplate(
      "Given the following story context, generate 2-3 keywords for each of background, middleground, and foreground. Use only words from the provided lists.\n\nContext: {input}\n\nBackground keywords: {background_keywords}\nMiddleground keywords: {middleground_keywords}\nForeground keywords: {foreground_keywords}\n\nGenerated keywords:\nBackground:"
    );

    const formattedPrompt = await prompt.format({
      input: input,
      background_keywords: sceneKeywords.background.join(", "),
      middleground_keywords: sceneKeywords.middleground.join(", "),
      foreground_keywords: sceneKeywords.foreground.join(", ")
    });

    const result = await this.llm.call(formattedPrompt);
    return result;
  }
}

// Create the integrated LangChain agent
async function createIntegratedSceneAgent() {
  const mainModel = new OpenAI({ temperature: 0.7 });
  const keywordModel = new HuggingFaceInference({
    model: "gpt-neo-1.3B", // or any other suitable model
    temperature: 0.5
  });

  const tools = [new SceneKeywordTool(keywordModel)];

  const executor = await initializeAgentExecutorWithOptions(tools, mainModel, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  return executor;
}

// Use the agent to analyze a scene
async function analyzeScene(agent:any, storyContext:string) {
  const input = `Based on this story context, describe the scene and generate appropriate keywords: ${storyContext}`;
  const result = await agent.call({ input });
  return result.output;
}

// Example usage
const agent = await createIntegratedSceneAgent();
const storyContext = "The party emerged from the dense forest, finding themselves at the edge of a cliff. Before them stretched a vast valley, shrouded in mist. In the distance, they could make out the silhouette of an ancient castle, its spires reaching into the stormy sky.";
const sceneDescription = await analyzeScene(agent, storyContext);
console.log(sceneDescription);