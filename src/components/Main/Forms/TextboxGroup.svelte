<script lang="ts">
  import { cn } from "$utilities/utils";
  import { BadgeHelp } from "lucide-svelte";

    export let id = "";
    export let name = "";
    export let label = "";
    export let title = "";
    export let value: any;
    export let type: string;
    export let iconHelp = false;
    export let helpText = "";
    function typeAction(node: { type: any; }) {
		node.type = type;
	}
</script>

<div class={cn($$props.class,"variant-filled-surface pl-2 pt-2 mt-4 mb-4 rounded-md")}>
    <label for="{name}" class="label font-bold" title="{title}">{label}</label>
    <div
      class="input-add border-0 input-group input-group-divider grid-cols-[1fr_auto]"
    >
      <input
        id="{id}"
        type="text"
        name="{name}"
        class=""
        bind:value={value}
        use:typeAction
      />
      {#if iconHelp}
        <span title="{helpText}"><BadgeHelp class="items-center mt-2 ml-4 mr-2 h-5 w-5" /></span>
      {/if}
    </div>
  </div>