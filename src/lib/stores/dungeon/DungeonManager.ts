import { get, writable, type Writable } from "svelte/store";
import type {
  DungeonConversation,
  DungeonGameSettings,
  DungeonManagerType,
  Summary,
} from "$lib/types/game";
import { dbGet, dbSet } from "$utilities/data/db";
import { summarise } from "$utilities/transformers/summarise";

export const DungeonManager = createDungeonManager();

function createDungeonManager() {
  const { subscribe, set, update } = writable<DungeonManagerType>();

  return {
    subscribe,
    set,
    update,
    async get(gameId: string, fetch?: Window["fetch"]) {
      if (!gameId || gameId.includes(".")) return;

      const result = await dbGet({
        db: `dungeons/${gameId}/dungeonManager`, fetch
      });
      console.log("DungeonManager get result:", result);
      if (!result) {
        // Reset DungeonManager
        console.log("Resetting DungeonManager");
        this.reset();
      } else {
        console.log("Setting DungeonManager to response");
        // Set DungeonManager to the response
        this.set(result);
      }
    },
    async save(gameId: string) {
      if (!gameId || gameId.includes(".")) return;
      const dm = get(this);
      if (!dm) { //This shouldn't happen........
        console.error("DungeonManager is undefined");
        return;
      }
      await dbSet({
        db: `dungeons/${gameId}/dungeonManager`,
        data: dm,
      });
    },
    async generateSummary(
      DGSS: DungeonGameSettings,
      Convos: DungeonConversation[],
      config: any
    ) {
        //TODO: Add in logic to include past summaries (if they exist) to generate new ones
      const thisStore = get(this);
      //copy convos to another variable as it seems to be linked to the store
        let conversations = structuredClone(Convos); //fuck knows. seems to be linked.
       console.log("Dungeon Manager:", thisStore);
      // Ensure thisStore is defined
      if (!thisStore) {
        console.error("thisStore is undefined");
        return;
      }

      // Ensure summaries is initialized
      if (!thisStore.summaries) {
        console.log("Summaries not initialized");
        thisStore.summaries = [];
      }
      //const config = getConfig(); //don't have time to fuck about this this. just take it in on call
      const currSumm = thisStore.summaries as Summary[];

      // Determine if a new summary should be generated
      const lastSummedAt =
        currSumm[currSumm.length - 1]?.positionSummarised || 0;
      const currentPos = conversations.length;
      const nextSummPos = lastSummedAt + config.summEvery;
      console.log("LastSummedAt CurrentPos NextSummPos",{lastSummedAt,currentPos,nextSummPos})
      // Check if a new summary should be generated
      const shouldGenerateSummary =
        (currSumm.length === 0 && currentPos >= config.summEvery) ||
        (currSumm.length > 0 && nextSummPos === currentPos);

      console.log("Should Generate Summary set to: ",shouldGenerateSummary)

      // Ensure the last config.summProtect items in Convos are not summarized
      const isProtected = currentPos <= config.summProtect;

      console.log("Remainder is protected?", isProtected)

      if (shouldGenerateSummary && !isProtected) {
        // Splice out only the number of items needed for the summary
        const summaryText = conversations.slice(
          lastSummedAt,
          currentPos - config.summProtect
        );
        console.log("Summary Text:", summaryText);
        // Generate the summary using the LLM
        try {
          const resp = await summarise(
            DGSS.llmTextSettings.autoSummarise,
            DGSS.llmActive,
            400,
            summaryText,
            currSumm[currSumm.length - 1]?.summary // Use the last summary as the past summary
          );
          if (resp.error) {
            console.error("Error generating summary:", resp.error);
            return;
          }
          // Generate a new summary
          console.log("Summary returned:", resp.response);
          const newSummary: Summary = {
            summary: resp.response, // Use the actual summary text from the response
            positionSummarised: currentPos,
            timestamp: Date.now(),
          };

          // Update the summaries array. Keep only the last config.summNumToUse summaries
          this.update((state) => {
            if (!state.summaries) state.summaries = [];

            state.summaries.push(newSummary);
            if (state.summaries.length > config.summNumToUse) {
              state.summaries = state.summaries.slice(-config.summNumToUse);
            }
            return state;
          });
          //Save it
          this.save(DGSS.game.id as string); //shut the fuck up Typescript. Nagging wee cum stain.
        } catch (error) {
          console.error("Error generating summary:", error);
        }
      } else {
        console.log("No summary generated");
      }
    },
    generateLlm: (DGSS: DungeonGameSettings) => {
      // Implementation for generateLlm
      console.log("generateLlm called");
    },
    generateSd: (DGSS: DungeonGameSettings) => {
      // Implementation for generateSd
      console.log("generateSd called");
    },
    generateVo: (DGSS: DungeonGameSettings) => {
      // Implementation for generateVo
      console.log("generateVo called");
    },
    reset: () => {
      // Implementation for reset
      update(() => ({
        state: {},
        summaries: [],
        player: {},
        characters: [],
        currentCharacter: {},
        currentLocation: {},
      }));
      console.log("reset called");
    },
  };
}
