<script lang="ts">
  import { getTokens } from "$utilities/utils";
  import { BadgeHelp } from "lucide-svelte";

  let tokens: Uint32Array | undefined;
  async function handleInput(e: Event): Promise<void> {
    const target = e.target as HTMLTextAreaElement;
    const lastChar = target.value.slice(-1);

    if ([" ", ".", "?", "!", ",", "\n"].includes(lastChar)) {
      tokens = await getTokens(target.value);
    }
  }
  async function handleBlur(e: Event): Promise<void> {
    const target = e.target as HTMLTextAreaElement;
    tokens = await getTokens(target.value);
  }
</script>

<div class="input-add input-group input-group-divider grid-cols-[1fr_auto]">
  <input type="text" class="" placeholder="Game Title" />
  <span title="Keep it simple. [No effect on AI Prompt]"><BadgeHelp class="items-center mt-2 ml-4 mr-2 h-6 w-6"/></span>
</div>
<div>
  <textarea
    on:input={handleInput}
    on:blur={handleBlur}
    class="textarea textarea-add overflow-y-auto h-48 w-full"
    placeholder="Premise. For example: You find yourself in the rugged heartland of Scotland, where you take on the storied mantle of %user_name%, a %user_description% with an uncanny knack for growing the finest barley this side of the Tweed. Life has been grand, filled with laughter, ale, and endless nights spinning tall tales by the hearth. But all that is set to change when word arrives that Fanny Williams, a power-hungry queen from south of the border, has set her sights on your fertile lands. With dreams of conquest dancing in her sinister head, she intends to lay waste to everything you hold dear. You must find a way to stop her, and her armies."
  ></textarea>
  <span class="text-xs">Tokens: {tokens?.length ?? 0}</span>
</div>
