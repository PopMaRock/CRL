<script lang="ts">
  import { DungeonGameSettingsStore } from "$stores/dungeon";
  import { onMount } from "svelte";
  export let onlyGameImage = true;

  onMount(async () => {
    if (!$DungeonGameSettingsStore.game.image && onlyGameImage) {
      const genre =
        $DungeonGameSettingsStore.game.genre.toLowerCase() ?? "fantasy";
      const response = await fetch(
        `/api/filesystem?path=/static/crl-images/dungeon-title-images/${genre}/`
      );
      const data = await response.json();
        if (response.ok && data.images && data.images.length > 0) {
          const randomImage =
            data.images[Math.floor(Math.random() * data.images.length)];
          $DungeonGameSettingsStore.game.image = `/crl-images/dungeon-title-images/${genre}/${randomImage}`;
        } else {
          console.error("Failed to retrieve images or no images found");
        }
    }
  });
</script>

<div
  class="snap-x snap-mandatory scroll-smooth flex w-full rounded-lg overflow-hidden"
>
  <img
    class="snap-end object-cover w-full h-[15vh] flex-shrink-0"
    src={$DungeonGameSettingsStore.game.image}
    loading="lazy"
  />
</div>
