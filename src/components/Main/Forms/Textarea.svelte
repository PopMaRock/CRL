<script lang="ts">
  import { cn } from "$utilities/utils";

  export let id = "";
  export let name = "";
  export let label = "";
  export let title = "";
  export let placeHolder = "";
  export let value: string;
  export let heightClass = "min-h-24";
  export let showLabel = true;
</script>

<div class={cn($$props.class, "dark:variant-filled-surface rounded-md mt-5 mb-5")}>
  {#if showLabel}
    <label for={name} class="label pl-2 pt-2 font-bold" {title}
      >{label}</label
    >
  {/if}
  <textarea
    id={id??name}
    {name}
    class={`textarea-add ${heightClass} w-full`}
    bind:value
    placeholder={placeHolder}
  ></textarea>
</div>
