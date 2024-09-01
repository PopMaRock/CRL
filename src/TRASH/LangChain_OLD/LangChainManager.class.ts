import { OpenAI, ChatOpenAI } from "@langchain/openai";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
} from "@langchain/core/prompts";

/**
 * Class representing a LangChain conversation manager.
 * This class manages conversation memory and handles interactions with the LangChain API.
 */
export class LangChainManager {
    public memory: ConversationSummaryBufferMemory;
    public chatPromptMemory: ConversationSummaryBufferMemory;
    public chain: ConversationChain;

    /**
     * Initializes a new instance of the LangChainManager class.
     * Sets up the conversation memory and chain with the specified models and configurations.
     */
    constructor() {
        // Initialize memory for conversation summary with OpenAI model
        this.memory = new ConversationSummaryBufferMemory({
            llm: new OpenAI({ model: "gpt-3.5-turbo-instruct", temperature: 0 }),
            maxTokenLimit: 10,
        });

        // Initialize chat prompt memory with ChatOpenAI model
        this.chatPromptMemory = new ConversationSummaryBufferMemory({
            llm: new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 }),
            maxTokenLimit: 10,
            returnMessages: true,
        });

        // Define the chat prompt template
        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
            ),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        // Initialize the conversation chain with the chat prompt and memory
        const model = new ChatOpenAI({ temperature: 0.9, verbose: true });
        this.chain = new ConversationChain({
            llm: model,
            memory: this.chatPromptMemory,
            prompt: chatPrompt,
        });
    }

    /**
     * Initializes the memory with some context.
     * Saves initial context to the memory and logs the history.
     */
    async initializeMemory() {
        await this.memory.saveContext({ input: "hi" }, { output: "whats up" });
        await this.memory.saveContext({ input: "not much you" }, { output: "not much" });
        const history = await this.memory.loadMemoryVariables({});
        console.log({ history });
    }

    /**
     * Initializes the chat prompt memory with some context.
     * Saves initial context to the chat prompt memory.
     */
    async initializeChatPromptMemory() {
        await this.chatPromptMemory.saveContext({ input: "hi" }, { output: "whats up" });
        await this.chatPromptMemory.saveContext({ input: "not much you" }, { output: "not much" });
    }

    /**
     * Predicts a new summary based on the chat history.
     * Retrieves messages from chat history and predicts a new summary.
     */
    async predictNewSummary() {
        const messages = await this.chatPromptMemory.chatHistory.getMessages();
        const previousSummary = "";
        const predictSummary = await this.chatPromptMemory.predictNewSummary(messages, previousSummary);
        console.log(JSON.stringify(predictSummary));
    }

    /**
     * Invokes the conversation chain with a given input.
     * 
     * @param input - The input message.
     * @returns The response from the conversation chain.
     */
    async invokeChain(input: string) {
        const response = await this.chain.invoke({ input });
        console.log({ response });
    }
}
/*
(async () => {
    const manager = new LangChainManager();

    await manager.initializeMemory();
    await manager.initializeChatPromptMemory();
    await manager.predictNewSummary();

    await manager.invokeChain("Hi, what's up?");
    await manager.invokeChain("Just working on writing some documentation!");
    await manager.invokeChain("For LangChain! Have you heard of it?");
    await manager.invokeChain("That's not the right one, although a lot of people confuse it for that!");
})();*/