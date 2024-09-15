<script lang="ts">
  import { restartGame } from "$utilities/chatfunctions/InteractionBoxMenus";
  import { validateForgeUrl } from "$utilities/stablediffusion/forge/api.controller";
  import { ListBox, ListBoxItem, popup } from "@skeletonlabs/skeleton";
  import { Menu, Skull, Image, DoorOpen } from "lucide-svelte";

  let textMenu: any;
  let imageMenu: any;

  // Reactive statement for textMenu
  $: (async () => {
    console.log("textMenu changed:", textMenu);
    if (textMenu === "restartGame") {
      await restartGame();
    }
  })();

  // Reactive statement for imageMenu
  $: console.log("imageMenu changed:", imageMenu);
  async function testFunc() {
    const result = await fetch("/api/transformers/sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `The villagers look at each other nervously but seem unconcerned by your sudden joke, probably thinking it's just another quirk from a townie coming back home after years away.

Your eyes scan the crowd as you continue speaking normally. "I'm not sure what kind of adventures await me here in Willow Creek," you say with a chuckle, trying to make light conversation while keeping an eye out for any suspicious individuals lurking about.

You notice Reginald Thorne walking towards your direction from across the square. His eyes narrow as he takes in your presence and his pace quickens, curiosity burning within him at seeing you so soon after rumors of The Golden Chalice's existence began circulating once more.`,
      }),
    });
    const data = await result.json();
    console.log(data);
  }
</script>

<div class="flex space-x-1 mr-2">
  <button
    type="button"
    class="mr-2 group"
    use:popup={{
      event: "click",
      target: `imageOptionsBox`,
      placement: "top",
      closeQuery: ".listbox-item",
    }}
  >
    <Image size={24} class="group-hover:text-warning-500" />
  </button>
  <div class="card w-48 shadow-xl py-2" data-popup={`imageOptionsBox`}>
    <ListBox rounded="rounded-none">
      <ListBoxItem bind:group={imageMenu} name="action" value="gallery">
        Open Gallery
      </ListBoxItem>
      <hr />
      <ListBoxItem bind:group={imageMenu} name="action" value="genPicture">
        Gen: Character
      </ListBoxItem>
      <ListBoxItem bind:group={imageMenu} name="action" value="genStory">
        Gen: Whole Story
      </ListBoxItem>
      <ListBoxItem bind:group={imageMenu} name="action" value="genLastMessage">
        Gen: Last Message
      </ListBoxItem>
      <ListBoxItem bind:group={imageMenu} name="action" value="genRawLast">
        Gen: Raw Last
      </ListBoxItem>
      <ListBoxItem bind:group={imageMenu} name="action" value="genBackground">
        Gen: Background
      </ListBoxItem>
    </ListBox>
    <div class="arrow bg-surface-100-800-token" />
  </div>
  <!-- END MAGIC GENERATION OPTIONS BOX-->
  <!-- TEST BUUTTON -->
  <button type="button" class="mr-2 group" on:click={testFunc}> Test</button>
  <button
    type="button"
    class=""
    use:popup={{
      event: "click",
      target: `textOptionsBox`,
      placement: "top",
      closeQuery: ".listbox-item",
    }}
  >
    <Menu class="h-5" />
  </button>
  <div class="card w-48 shadow-xl py-2" data-popup={`textOptionsBox`}>
    <ListBox rounded="rounded-none">
      <ListBoxItem bind:group={textMenu} name="action" value="regenerateLast">
        Regenerate Last
      </ListBoxItem>

      <hr />
      <ListBoxItem bind:group={textMenu} name="action" value="exitGame">
        <div class="flex items-center">
          <DoorOpen class="mr-2 text-warning-500" /> Exit Game
        </div>
      </ListBoxItem>
      <ListBoxItem bind:group={textMenu} name="action" value="restartGame">
        <div class="flex items-center">
          <Skull class="mr-2 text-error-500" /> Restart Game
        </div>
      </ListBoxItem>
    </ListBox>
    <div class="arrow bg-surface-100-800-token" />
  </div>
</div>
