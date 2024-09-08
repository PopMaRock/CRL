<script lang="ts">
  import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
  import {
    ArrowRight,
    EllipsisVertical,
    StepBack,
    StepForward,
  } from "lucide-svelte";

  let elemMovies: HTMLDivElement;

  function multiColumnLeft(): void {
    let x = elemMovies.scrollWidth;
    if (elemMovies.scrollLeft !== 0)
      x = elemMovies.scrollLeft - elemMovies.clientWidth;
    elemMovies.scroll(x, 0);
  }

  function multiColumnRight(): void {
    let x = 0;
    // -1 is used because different browsers use different methods to round scrollWidth pixels.
    if (
      elemMovies.scrollLeft <
      elemMovies.scrollWidth - elemMovies.clientWidth - 1
    )
      x = elemMovies.scrollLeft + elemMovies.clientWidth;
    elemMovies.scroll(x, 0);
  }
  const games = [
    {
      name: "Game 1",
      imageUrl: "/crl-images/welcome/welcome12.png",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 2",
      imageUrl: "/crl-images/welcome/welcome3.png",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 3",
      imageUrl: "/crl-images/welcome/welcome17.png",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 4",
      imageUrl: "/crl-images/welcome/welcome15.png",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 5",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 6",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 1",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 2",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 3",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 4",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 5",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
    {
      name: "Game 6",
      imageUrl: "https://via.placeholder.com/150",
      url: "https://via.placeholder.com/150",
      combobox: "",
    },
  ];
</script>

<h1 class="text-xl font-bold">Recently played</h1>
<div class="p-4 pr-0 relative group max-w-[120vh]">
  <!-- Carousel -->
  <div
    bind:this={elemMovies}
    class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-hidden"
  >
    {#each games as game,index}
      <div
        class="block card card-hover shrink-0 snap-start w-[29vh] h-[40vh] overflow-hidden relative"
      >
        <!-- Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-br variant-gradient-primary-secondary opacity-10 pointer-events-none"
        ></div>

        <header
          class="card-header relative w-full"
          style="background-image: url({game.imageUrl}); background-size: cover; background-position: center; height: 45%;"
        >
          <!-- Gradient Overlay for Header -->
          <div
            class="absolute inset-0 bg-gradient-to-br variant-gradient-primary-secondary opacity-30 pointer-events-none"
          ></div>

          <div
            class="absolute top-0 left-0 p-2 pl-4 text-white w-full bg-gradient-to-b from-black/30 via-black/30 to-transparent flex items-center justify-between"
          >
            <div>
              <span class="font-bold text-xs">by Biosonik</span>
              <span class="font-bold text-xs">6 days ago</span>
            </div>
            
            <button class="ml-auto" use:popup={{
                event: 'click',
                target: `gameOptionsBox${index}`,
                placement: 'bottom',
                closeQuery: '.listbox-item'
            }}>
                <EllipsisVertical class="w-5 h-5" />
            </button>
            <div class="card w-48 shadow-xl py-2" data-popup={`gameOptionsBox${index}`}>
                <ListBox rounded="rounded-none">
                    <ListBoxItem bind:group={game.combobox} name="action" value="edit">Edit</ListBoxItem>
                    <ListBoxItem bind:group={game.combobox} name="action" value="delete">Delete</ListBoxItem>
                </ListBox>
                <div class="arrow bg-surface-100-800-token" />
            </div>
          </div>
        </header>
        <section class="p-4">
          The cold, dark chamber beneath the Noxian fortress is silent, save for
          the slow drip of water echoing through
        </section>
        <footer class="card-footer flex justify-end">
          <button class="btn variant-ghost-primary btn-sm items-center"
            >Continue <ArrowRight class="w-4 h-4" /></button
          >
        </footer>
      </div>
    {/each}
  </div>
  <!-- Button: Left -->
  <button
    type="button"
    class="btn-icon absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    on:click={multiColumnLeft}
  >
    <StepBack />
  </button>
  <!-- Button: Right -->
  <button
    type="button"
    class="btn-icon absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    on:click={multiColumnRight}
  >
    <StepForward />
  </button>
</div>
