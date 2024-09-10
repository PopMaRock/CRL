<script lang="ts">
  import { readablestreamStore } from "$stores/readableStreamStore";
  import { onDestroy, onMount } from "svelte";
  import StoryLayout from "$components/Dungeon/Chat/StoryLayout.svelte";
  import { page } from "$app/stores";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
  import { Generator } from "$utilities/generator.class";
  export let data: {
    gameId: string;
  };
  const gen = new Generator();
  const response = readablestreamStore();
  let errorMessage = "";
  onMount(async () => {
    // Set the stores with the data received from the server
    console.log("mounted Dungeon session");
    console.log("data", data.gameId);
    console.log("page", $page);
    console.log("DungeonConversationStore", $DungeonConversationStore);
    console.log("DungeonSettingsStore", $DungeonGameSettingsStore);
  });
  onDestroy(() => {
    console.log("destroyed Dungeon session");
    //destroy the stores
  });

  async function sendMessage(message: string, actionOption: string) {
    if ($response.loading) return; //calm doon. Already doing something. Sake pal.
    //add the message to the conversation
    console.log("actionOption before generator", actionOption);
    if (!message && !actionOption) return;
    try {
      await gen.handleMessage(response, message, actionOption);
      console.log("Conversation up to now...", $DungeonConversationStore);
    } catch (error: any) {
      console.error(error);
      errorMessage = error.message;
    }
  }
  function handleSendMessage(event: any) {
    //shut the fuck up Typescript.
    const { message, actionOption } = event.detail;
    sendMessage(message, actionOption);
  }
</script>
{#if data && $DungeonConversationStore && $DungeonGameSettingsStore}
<StoryLayout {response} bind:errorMessage on:sendMessage={handleSendMessage} />
{/if}
