<script lang="ts">
  import CharacterCard from '$components/EngineElements/CharacterCard.svelte';
  import { onMount } from 'svelte';

  let slider1: HTMLDivElement;
  let slider2: HTMLDivElement;
  let isHovered1 = false;
  let isHovered2 = false;

  onMount(() => {
    const cloneItems = (slider: HTMLDivElement) => {
      const items = Array.from(slider.children);
      items.forEach(item => {
        const clone = (item as HTMLElement).cloneNode(true);
        slider.appendChild(clone);
      });
    };

    cloneItems(slider1);
    cloneItems(slider2);
  });
</script>

<div class="outer-container flex justify-center items-center overflow-hidden relative -mt-[10vh] -mb-[10vh] pr-20">
  <div class="slider-container h-full w-[calc(50%-5px)] transform rotate-[10deg] overflow-hidden relative mr-2.5">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="slider flex flex-col animate-scroll" bind:this={slider1} on:mouseenter={() => isHovered1 = true} on:mouseleave={() => isHovered1 = false} style="animation-play-state: {isHovered1 ? 'paused' : 'running'};">
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
    </div>
  </div>
  <div class="slider-container h-full w-[calc(50%-5px)] transform rotate-[10deg] overflow-hidden relative">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="slider reverse flex flex-col animate-scroll-reverse" bind:this={slider2} on:mouseenter={() => isHovered2 = true} on:mouseleave={() => isHovered2 = false} style="animation-play-state: {isHovered2 ? 'paused' : 'running'};">
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
      <div class="slider-item mb-4"><CharacterCard character={null} /></div>
    </div>
  </div>
</div>

<style>
  .outer-container {
    width: 70vh; /* Adjust the width to accommodate both sliders */
  }

  .slider-container {
    width: 17vh;
  }

  @keyframes scroll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  @keyframes scroll-reverse {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0);
    }
  }

  .animate-scroll {
    animation: scroll 40s linear infinite;
  }

  .animate-scroll-reverse {
    animation: scroll-reverse 40s linear infinite;
  }
</style>