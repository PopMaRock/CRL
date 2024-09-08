<script lang="ts">
  import { cn } from "$utilities/utils";
  import { StepBack, StepForward } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";

  export let showThumbs = false;
  let elemCarousel: HTMLDivElement;
  let currentIndex = 0;
  let interval:any;

  const unsplashIds = [
    "welcome1",
    "welcome2",
    "welcome3",
    "welcome4",
    "welcome5",
    "welcome6",
  ];

  function carouselLeft(): void {
    currentIndex = (currentIndex === 0) ? unsplashIds.length - 1 : currentIndex - 1;
    scrollToCurrentIndex();
  }

  function carouselRight(): void {
    currentIndex = (currentIndex === unsplashIds.length - 1) ? 0 : currentIndex + 1;
    scrollToCurrentIndex();
  }

  function carouselThumbnail(index: number) {
    currentIndex = index;
    scrollToCurrentIndex();
  }

  function scrollToCurrentIndex() {
    elemCarousel.scroll({
      left: elemCarousel.clientWidth * currentIndex,
      behavior: 'smooth'
    });
  }

  function startAutoScroll() {
    interval = setInterval(() => {
      carouselRight();
    }, 5000);
  }

  function stopAutoScroll() {
    clearInterval(interval);
  }

  onMount(() => {
    startAutoScroll();
  });

  onDestroy(() => {
    stopAutoScroll();
  });
</script>

<!-- A11y bitchin' at scroll stops. Below are to shut it the fuck up even though it's meant to be off in svelte config ... fuck sake-->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class={cn($$props.class, "p-4 relative group rounded-full w-[130vh] h-[40vh] flex")}
     on:mouseover={stopAutoScroll}
     on:mouseout={startAutoScroll}>
    <!-- Image Carousel -->
    <div class="relative w-[80vh] h-full">
      <!-- Button: Left -->
      <button
        type="button"
        class="btn-icon absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        on:click={carouselLeft}
        aria-label="Previous Image"
      >
        <StepBack />
      </button>
      <!-- Full Images -->
      <div
        bind:this={elemCarousel}
        class="snap-x snap-mandatory scroll-smooth flex w-full h-full rounded-lg overflow-hidden"
      >
        {#each unsplashIds as unsplashId}
          <img
            class="snap-end object-cover w-full h-full flex-shrink-0"
            src="/crl-images/welcome/{unsplashId}.png"
            alt={unsplashId}
            loading="lazy"
          />
        {/each}
      </div>
      <!-- Button: Right -->
      <button
        type="button"
        class="btn-icon absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        on:click={carouselRight}
        aria-label="Next Image"
      >
        <StepForward />
      </button>
    </div>
    <!-- Thumbnails Column -->
    <div class="flex flex-col justify-between ml-4 h-[37vh]">
      {#each unsplashIds.slice(0, 4) as _, i}
        <button
          type="button"
          class={cn("w-[40vh] flex-grow variant-ghost-surface rounded-md mb-2", { "variant-ghost-primary": currentIndex === i })}
          on:click={() => carouselThumbnail(i)}
          aria-label={`Thumbnail ${i + 1}`}
        >
          Thumbnail {i + 1}
        </button>
      {/each}
    </div>
</div>

{#if showThumbs}
  <div class="card p-4 grid grid-cols-6 gap-4">
    {#each unsplashIds as unsplashId, i}
      <button type="button" on:click={() => carouselThumbnail(i)}>
        <img
          class="rounded-container-token"
          src="/crl-images/welcome/{unsplashId}.png"
          alt={unsplashId}
          loading="lazy"
        />
      </button>
    {/each}
  </div>
{/if}
