<script lang="ts">
  import { cn } from "$utilities/utils";

  export let id = "";
  export let name = "";
  export let label = "";
  export let title = "";
  export let placeholder = "";
  export let value: string;
  export let heightClass = "min-h-24";
  export let showLabel = true;
  import { createEventDispatcher } from "svelte";
  export let textareaElement: HTMLTextAreaElement | null = null;
  const dispatch = createEventDispatcher();
  function keydown(e: KeyboardEvent) {
    dispatch("keydown", e);
  }
</script>

<div
  class={cn($$props.class, "dark:variant-filled-surface rounded-md mt-5 mb-5")}
>
  {#if showLabel}
    <label for={name} class="label pl-2 pt-2 font-bold" {title}>{label}</label>
  {/if}
  <slot></slot>
  <textarea
    id={id ?? name}
    {name}
    class={`textarea-add ${heightClass} w-full`}
    bind:value
    {placeholder}
    on:keydown={keydown}
    bind:this={textareaElement}
  ></textarea>
</div>
