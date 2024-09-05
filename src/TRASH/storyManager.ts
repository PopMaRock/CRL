
import { cutTrailingSentence, splitFirstSentence } from '../lib/modes/dungeon/story/utils';

export class Story {
    storyStart: string;
    context: string;
    rating: number;
    actions: string[];
    results: string[];
    seed: any;
    choices: any[];
    possibleActionResults: any;
    uuid: any;
    gameState: any;
    memory: number;

    constructor(storyStart: string, context = "", seed: any = null, gameState: any = null) {
        this.storyStart = storyStart;
        this.context = context;
        this.rating = -1;
        this.actions = [];
        this.results = [];
        this.seed = seed;
        this.choices = [];
        this.possibleActionResults = null;
        this.uuid = null;
        this.gameState = gameState || {};
        this.memory = 20;
    }

    initFromDict(storyDict: any) {
        this.storyStart = storyDict.story_start;
        this.seed = storyDict.seed;
        this.actions = storyDict.actions;
        this.results = storyDict.results;
        this.choices = storyDict.choices;
        this.possibleActionResults = storyDict.possible_action_results;
        this.gameState = storyDict.game_state;
        this.context = storyDict.context;
        this.uuid = storyDict.uuid;
        this.rating = storyDict.rating || -1;
    }

    initializeFromJson(jsonString: string) {
        const storyDict = JSON.parse(jsonString);
        this.initFromDict(storyDict);
    }

    toDict(): any {
        return {
            story_start: this.storyStart,
            seed: this.seed,
            actions: this.actions,
            results: this.results,
            choices: this.choices,
            possible_action_results: this.possibleActionResults,
            game_state: this.gameState,
            context: this.context,
            uuid: this.uuid,
            rating: this.rating
        };
    }

    toJson(): string {
        return JSON.stringify(this.toDict());
    }
}

export class StoryManager {
    story: Story;
    inferenceTimeout: number;

    constructor(generator: any) {
        this.story = new Story("");
        //updateStory(this.story);
        this.inferenceTimeout = 120;
    }

    loadStory(story: any, fromJson = false): string {
        if (fromJson) {
            this.story = new Story("");
            this.story.initializeFromJson(story);
        } else {
            this.story = story;
        }
        //updateStory(this.story);
        return this.story.toString();
    }

    jsonStory(): string {
        return this.story.toJson();
    }

    storyContext(): void {
        //return this.story.latestResult();
    }
}

export class UnconstrainedStoryManager extends StoryManager {
   

    generateResult(action: string): void {
        //const block = this.generator.generate(this.storyContext() + action);
        //return block;
    }

    setContext(context: string) {
        this.story.context = context;
        //updateStory(this.story);
    }

    getContext() {
        //return getStoryContext();
    }
}

class ConstrainedStoryManager extends StoryManager {
    actionPhrases: string[];
    seed: any;

    constructor(generator: any, actionVerbsKey = "classic") {
        super(generator);
        this.actionPhrases = ['']; // getActionVerbs(actionVerbsKey);
        this.seed = null;
    }

    startNewStoryGenerate(storyPrompt: string, gameState: any = null): string {
        //super.startNewStory(storyPrompt, gameState);
        //this.story.possibleActionResults = this.getActionResults();
        //updateStory(this.story);
        return this.story.storyStart;
    }

    loadStory(story: any, fromJson = false): string {
        const result = super.loadStory(story, fromJson);
        //updateStory(this.story);
        return result;
    }

    getPossibleActions(): string[] {
        if (!this.story.possibleActionResults) {
            this.story.possibleActionResults = this.getActionResults();
        }
        return this.story.possibleActionResults.map((actionResult: any) => actionResult[0]);
    }

    act(actionChoiceStr: string): [string, string[]] | [null, null] {
        let actionChoice: number;
        try {
            actionChoice = parseInt(actionChoiceStr);
        } catch {
            console.log("Error invalid choice.");
            return [null, null];
        }

        if (actionChoice < 0 || actionChoice >= this.actionPhrases.length) {
            console.log("Error invalid choice.");
            return [null, null];
        }

        this.story.choices.push(actionChoice);
        const [action, result] = this.story.possibleActionResults[actionChoice];
        //addToStory(action, result);
        //this.story.possibleActionResults = this.getActionResults();
        //updateStory(this.story);
        return [result, this.getPossibleActions()];
    }
}