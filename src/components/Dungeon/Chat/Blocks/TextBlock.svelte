<script lang="ts">
  import { cn } from "$lib/utils/utils";
  import { get, writable } from "svelte/store";
  import NarrationPlayer from "../NarrationPlayer.svelte";
  import BlockContainer from "./BlockContainer.svelte";
  import { fade } from "svelte/transition";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { TextGenerateEffect } from "$components/Base/UI-Effects/text-generation";
  import {
    Ellipsis,
    Image,
    AudioLines,
    EyeOff,
    Split,
    Trash2,
    Paintbrush
  } from "lucide-svelte";
  import { DungeonConversationStore } from "$stores/dungeon/DungeonConversation";
  import { ListBox, ListBoxItem, popup } from "@skeletonlabs/skeleton";
  export let item: DungeonConversation | string;
  export let blockId = 0;
  export let offerAudio = true;
  export let isLast = false;
  export let streaming = false;
  export let fadein = false; //TODO: Implement fadein
  export let streamingAllowed = false;

  let isEditing = false;
  let inputValue = "";
  let content = "";

  const isHover = writable(false);
  const dispatch = createEventDispatcher();
  function formatText() {
    if (typeof item === "string" || streaming) {
      console.log("it's streaming...");
      return;
    }
    if (
      item.content !== null &&
      typeof item.content === "string" &&
      item?.role === "user"
    ) {
      let content = item.content;
      // Italicize quotes
      content = content.replace(/"([^"]*)"/g, '<i>"$1"</i>');
      if (content.startsWith(">")) content = content.replace(/>/g, "");
      // Wrap in a card
      return `<blockquote class="blockquote font-smoothing text-lg">${content}</blockquote>`;
    }
    return item?.content;
  }
  // Get the initial content
  // Get the initial content if item is not a string
  $: if (typeof item !== "string") {
    const conversation = get(DungeonConversationStore)[blockId];
    if (conversation && conversation.content !== undefined) {
      content = conversation.content;
    }
  } else {
    content = item;
  }

  // Function to enable editing
  function enableEditing() {
    isEditing = true;
    inputValue = content;
    setTimeout(() => {
      const textarea = document.querySelector(`#textarea-${blockId}`);
      if (textarea) {
        adjustTextareaHeight(textarea);
        //textarea.focus() -- doesn't exist on textarea
      }
    }, 0);
  }
  // Function to adjust the height of the textarea
  function adjustTextareaHeight(textarea: any) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  // Function to save the changes
  function saveChanges() {
    DungeonConversationStore.update((conversations) => {
      conversations[blockId].content = inputValue;
      return conversations;
    });
    isEditing = false;
  }

  // Function to handle click outside
  function handleClickOutside(event: any) {
    if (isEditing && !event.target.closest(".editable")) {
      saveChanges();
    }
  }
  // Add event listener for clicks outside
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });
  // Remove event listener on destroy
  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  let optionsMenu: any;
  $: (async () => {
    console.log("optionsMenu changed:", optionsMenu);
    if (optionsMenu === "delete") {
      dispatch("remove");
    }
    if (optionsMenu === "genPicture") {
      dispatch("genPicture");
    }
  })();
</script>

<BlockContainer>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:mouseenter={() => {
      if (typeof item !== "string" || !streaming) isHover.set(true);
    }}
    on:mouseleave={() => {
      if (typeof item !== "string" || !streaming) isHover.set(false);
    }}
  >
    {#if $isHover}
      <div transition:fade>
        {#if typeof item !== "string" || !streaming}
        <div class="flex items-center relative mr-1 text-surface-400">
          <button
            type="button"
            title="Message options"
            class="mr-2 group absolute top-0 right-4 p-1 hover:text-surface-200"
            use:popup={{
              event: "click",
              target: `optionsOptionsBox${blockId}`,
              placement: "left",
              closeQuery: ".listbox-item",
            }}
          >
            <Ellipsis size={20} />
          </button>
          <div
            class="card w-48 shadow-xl py-2"
            data-popup={`optionsOptionsBox${blockId}`}
          >
            <ListBox rounded="rounded-none">
              <ListBoxItem
                bind:group={optionsMenu}
                name="action"
                value="genPicture"
              >
                <div class="flex items-center">
                  <Paintbrush class="mr-2" />Gen: Image
                </div>
              </ListBoxItem>
              <ListBoxItem
                bind:group={optionsMenu}
                name="action"
                value="genNarration"
              >
                <div class="flex items-center">
                  <AudioLines class="mr-2"/>Gen: Narration
                </div>
              </ListBoxItem>
              <hr />
              <ListBoxItem
                bind:group={optionsMenu}
                name="action"
                value="excludeFromPrompt"
              >
                <div class="flex items-center">
                  <EyeOff class="mr-2"/>Ex.from History
                </div>
              </ListBoxItem>
              <ListBoxItem
                bind:group={optionsMenu}
                name="action"
                value="createBranch"
              >
                <div class="flex items-center"><Split class="mr-2"/>Create Branch</div>
              </ListBoxItem>
            </ListBox>
            <div class="arrow bg-surface-100-800-token" />
          </div>
          <button 
            type="button" 
            title="Delete message" 
            class="group absolute top-0 right-0 p-1 hover:text-error-600"
            on:click={() => {
              optionsMenu = "delete";
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
        {/if}
      </div>
    {/if}
    <div
      id={`chatMessage${blockId}`}
      class={cn(
        "text-normal whitespace-pre-wrap rounded-md",
        $isHover && "bg-sky-300/10"
      )}
    >
      <p
        transition:fade={{ delay: 150, duration: 100 }}
        class="chat-text font-smoothing"
      >
        {#if isEditing}
          <!--<textarea> is given a unique ID to ensure the correct element is targeted for editing height adjustment -->
          <textarea
            id={`textarea-${blockId}`}
            bind:value={inputValue}
            class="!m-2 !p-4 editable"
            on:blur={saveChanges}
            on:input={(event) => adjustTextareaHeight(event.target)}
          ></textarea>
        {:else}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <span class="editable" on:click={enableEditing}>
            {#if typeof item !== "string" && !streaming && !isLast}
              {@html formatText()}
            {:else if streaming || (!streamingAllowed && isLast)}
              <TextGenerateEffect words={content} />
            {/if}
          </span>
        {/if}
      </p>
    </div>
    {#if blockId && offerAudio && !streaming}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        id="chatMessageNarrationPlayer{blockId}"
        class="flex w-full items-center justify-center"
        style="min-height: 27px;"
      >
        {#if $isHover}
          <div class="flex w-full items-center justify-center" transition:fade>
            <div class="border-foreground/20 flex-grow border-t px-2" />
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="px-2" transition:fade>
              <NarrationPlayer {blockId} />
            </div>
            <div class="border-foreground/20 flex-grow border-t px-2" />
          </div>
        {/if}
      </div>
    {/if}
  </div>
</BlockContainer>

<style type="postcss">
  .editable {
    width: 100%;
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    border: none;
    background: none;
    resize: none;
    overflow: hidden;
  }
  .editable:focus {
    outline: none;
  }
</style>
