<script lang="ts">
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import { LoaderIcon, SendIcon } from "lucide-svelte";
  import Button from "../../Base/FormElements/button.svelte";
  import Textarea from "$components/Base/FormElements/Textarea.svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import InteractionBoxMenus from "./InteractionBoxMenus.svelte";
  export let input: string;
  export let isLoading: boolean;

  let inputRef: HTMLTextAreaElement;
  let actionOption = "do";
  const dispatch = createEventDispatcher();

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    inputRef?.focus();
    if (input.trim().length < 1) {
      dispatch("advance"); //this is the equivilent of a "continue" button
    }
    dispatch("sendMessage", {
      message: input.trim(),
      selectedOption: actionOption,
    });
    input = ""; //clear input.
  };
  const handleKeyDown = (e: CustomEvent) => {
    const event = e.detail as KeyboardEvent;
    if (event.key === "Enter" && !event.shiftKey) {
      handleFormSubmit(event);
    }
  };
  function adjustHeight() {
    if (inputRef) {
      inputRef.style.height = "70px";
      inputRef.style.height = `${inputRef.scrollHeight}px`;
    }
  }
  $: adjustHeight();
  onMount(() => {
    adjustHeight();
  });
  afterUpdate(() => {
    adjustHeight();
  });
</script>

<form class="flex w-full gap-2" on:submit={handleFormSubmit}>
  <div class="w-full max-h-[15vh] mb-10">
    <!-- svelte-ignore a11y-autofocus -->
    <Textarea
      class="focus:ring-2 focus:ring-blue-500 w-full pl-3 pr-6"
      showLabel={false}
      bind:value={input}
      placeholder="Type your message here. Send an empty message to continue."
      bind:textareaElement={inputRef}
      on:keydown={handleKeyDown}
      disabled={isLoading}
    >
      <div class="pt-2 flex justify-between items-center">
        <RadioGroup
          active="variant-filled-primary"
          hover="hover:variant-soft-primary"
        >
          <RadioItem bind:group={actionOption} name="action" value={"do"}
            >Do</RadioItem
          >
          <RadioItem bind:group={actionOption} name="action" value={"say"}
            >Say</RadioItem
          >
          <RadioItem bind:group={actionOption} name="action" value={"see"}
            >See</RadioItem
          >
          <RadioItem bind:group={actionOption} name="action" value={"story"}
            >Story</RadioItem
          >
        </RadioGroup>
        <InteractionBoxMenus />
      </div>
    </Textarea>
  </div>
  <div class="flex gap-2 items-center">
    <Button type="submit" disabled={isLoading}>
      {#if isLoading}
        <LoaderIcon size={24} class="animate-spin" />
      {/if}
      {#if !isLoading}
        <SendIcon size={24} />
      {/if}
    </Button>
  </div>
</form>

<style>
  textarea:focus {
    outline: none;
    box-shadow: none;
  }
</style>
