import { OpenAI, ChatOpenAI } from "@langchain/openai";
import  SceneAnalysisTool  from "./Utils/SceneAnalyser"; // Assuming this is a custom tool you have created
import { LangChainManager } from "./LangChainManager.class";
import { initializeAgentExecutorWithOptions } from "some-agent-library"; // Replace with the actual import

/**
 * Class representing a LangChain analyser.
 * Extends the LangChainManager class to add scene analysis functionalities.
 */
export class LangChainAnalyser extends LangChainManager {
    private model: OpenAI;
    private tools: SceneAnalysisTool[];
    private executor: any;

    constructor() {
        super();
        this.model = new OpenAI({ temperature: 0 });
        this.tools = [new SceneAnalysisTool()];
    }

    /**
     * Initializes the agent executor.
     */
    async initializeExecutor() {
        this.executor = await initializeAgentExecutorWithOptions(this.tools, this.model, {
            agentType: "zero-shot-react-description",
        });
    }

    /**
     * Analyzes the given story text and extracts scene elements for an RPG adventure.
     * 
     * @param storyText - The story text to analyze.
     * @returns The extracted scene elements.
     */
    async analyzeStory(storyText: string): Promise<any> {
        if (!this.executor) {
            await this.initializeExecutor();
        }

        const result = await this.executor.call({
            input: "Analyze the following story text and extract scene elements for an RPG adventure: " + storyText,
        });

        const sceneElements = JSON.parse(result.output);
        return sceneElements;
    }
}