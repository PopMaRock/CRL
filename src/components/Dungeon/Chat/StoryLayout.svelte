<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import TextBlock from "./Blocks/TextBlock.svelte";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { ArrowDown } from "lucide-svelte";
  import Button from "../../Base/FormElements/button.svelte";
  import { useBackgroundMusic } from "./useAudio"; // Import the function
  import InteractionBox from "./InteractionBox.svelte";
  import DynaBackground from "../DynaBackground.svelte";
  import TypingIndicator from "./TypingIndicator.svelte";
  import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  export let response: any; //this needs to constantly be passed around, like a country girl at a frat party.
  export let errorMessage = "";

  const inView = writable(true);
  const dispatch = createEventDispatcher();

  let scrollEndDiv: HTMLDivElement;

  const scrollToBottom = () => {
    const container = document.getElementById("scroll-end-div");
    container?.scrollIntoView({ behavior: "smooth" });
  };

  let actionOption = "do";
  let message = "";

  //const { setUrl: setBackgroundMusicUrl } = useBackgroundMusic() // Destructure the setUrl function

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.set(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (scrollEndDiv) {
      observer.observe(scrollEndDiv);
    }

    return () => {
      if (scrollEndDiv) {
        observer.unobserve(scrollEndDiv);
      }
    };
  });
  function dispatchMessage(e: Event) {
    e.preventDefault();
    if (message.length < 1) {
      errorMessage = "Please enter a message.";
      return;
    }
    errorMessage = "";
    console.log("actionOption ", actionOption);
    dispatch("sendMessage", { message, actionOption });
  }
  let input = "";

  const advance = () => {
    message = "empty";
    actionOption = "continue";
    dispatchMessage(new Event("click"));
  };
  // Call scrollToBottom after each update to push scroll to the bottom
  afterUpdate(() => {
    if ($DungeonConversationStore.length > 0 || $response.loading) {
      scrollToBottom();
    }
  });
</script>

<div
  id="quest-narrative-container"
  class="mx-auto flex h-[100dvh] w-full max-w-6xl flex-grow flex-col overflow-hidden px-4 pb-6 pt-10"
>
  <!--MAIN CONTAINER-->
  <!--///-->
  <div class="absolute bottom-0 left-[-15vh] right-0 top-0 -z-20">
    <!--<DynaBackground
      layers={{
        background: ["/dynabackground/background/mountain.png"],
        middleground: [],
        foreground: ["/dynabackground/foreground/mist.png"],
  }}
    />-->
  </div>
  <div class="flex h-full overflow-hidden">
    <div
      class="absolute bottom-0 left-0 right-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      aria-hidden="true"
    >
      <div
        class="variant-gradient-primary-secondary h-full w-full bg-gradient-to-br opacity-10"
      />
    </div>

    <!-- Content below only -->
    <!-- QuestNarrativeContainer -->
    <div class="relative w-full">
      <main
        id="narrative-container"
        class="flex h-full w-10/12 flex-col-reverse justify-end overflow-auto scroll-smooth"
      >
        <div class="flex w-full flex-col gap-8 overflow-auto pb-[30vh]">
          <!-- Messages -->
          {#if $DungeonConversationStore.length > 0}
            {#each $DungeonConversationStore as item, index}
              <TextBlock
                blockId={index}
                {item}
                streamingAllowed={$DungeonGameSettingsStore.llmTextSettings.stream}
                isLast={index === $DungeonConversationStore.length - 1}
                fadein={index === $DungeonConversationStore.length - 1
                  ? !$DungeonGameSettingsStore.llmTextSettings.stream
                  : false}
                on:remove={async () => {
                  console.log("Removing", index);
                  await DungeonConversationStore.remove(index, $DungeonGameSettingsStore.game.id)
                }}
              />
            {/each}
            {#if $response.loading && $DungeonGameSettingsStore.llmTextSettings.stream}
              {#await new Promise((res) => setTimeout(res, 400)) then _}
                {#if $response.text == ""}
                  <TypingIndicator />
                {:else}
                  <TextBlock streaming={true} blockId={-1} item={$response.text} />
                {/if}
              {/await}
            {/if}
          {/if}
          <!-- SCROLLPISH -->
          <div class="w-full" id="anchor">
            <div
              bind:this={scrollEndDiv}
              id="scroll-end-div"
              class="h-[1px] w-full"
            />
          </div>
          {#if !$inView}
            <Button
              on:click={scrollToBottom}
              variant="outline"
              class="absolute bottom-4 right-4 z-50 aspect-square rounded-full !p-2"
            >
              <ArrowDown size={16} />
            </Button>
          {/if}
          <!-- /SCROLLPISH -->
          <!-- End QuestNarrativeContainer -->
        </div>
        <!-- End Messages -->
      </main>
    </div>
  </div>
  <div
    class="relative mb-2 h-36 flex w-10/12 flex-col items-end justify-center gap-2 pt-1"
  >
      <InteractionBox
        on:advance={() => {
          advance();
        }}
        on:sendMessage={(e) => {
          message = e.detail.message;
          actionOption = e.detail.selectedOption;
          dispatchMessage(e);
        }}
        {input}
        isLoading={$response.isLoading}
      />
  </div>
</div>
