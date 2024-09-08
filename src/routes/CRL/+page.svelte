<script>
  import CharacterVerticalCarousel from "$components/Main/CharacterVerticalCarousel.svelte";
import { fade } from "svelte/transition"
export let data;
</script>
<div transition:fade={{ duration: 700 }}>
    <!-- TAILWIND HERO -->
    <div class="relative isolate overflow-hidden h-screen">
        <svg class="absolute inset-0 -z-10 w-full  [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="0787a7c5-978c-4f66-83c7-11c213f99cb7" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" />
        </svg>
        <div class="mx-20 max-w-7xl pr-4 pb-24 pt-10 sm:pb-32 lg:flex lg:pr-4 lg:py-30">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-2xl lg:flex-shrink-0 lg:pt-8">
            <div class="mt-10 sm:mt-32 lg:mt-16">
              <h2 class="sm:mx-auto sm:w-10/12 md:w-2/3 font-black text-3xl text-center sm:text-3xl md:text-2xl lg:w-auto lg:text-left xl:text-3xl">
                <span class="relative text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-500 dark:from-primary-400 dark:to-primary-900">
                  Hey {data?.user?.name}
                </span>
              </h2>
            </div>
            <h1 class="mt-10 text-4xl font-bold tracking-tight  sm:text-6xl">CRL: Local Adventures.</h1>
            <p class="mt-6 text-lg leading-8 ">Prepare for a weird session of mystical, cyber mayhem conveyed in text and imagery - if you have Stable Diffusion or an API key for online robbers.</p>
            <div class="mt-10 flex items-center gap-x-6">
              <a href="#" class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">New Game</a>
              <a href="#" class="text-sm font-semibold leading-6">Continue <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div class="max-w-5xl lg:mr-0 lg:mt-0 lg:max-w-none">
              <CharacterVerticalCarousel />
          </div>
        </div>
      </div>
     <!-- /TAILWIND HERO-->
</div>