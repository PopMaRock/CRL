<script lang="ts">
  import { LoaderIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
	import Button from './button.svelte'
	import { useAudio, type AudioControls, type AudioState } from './useAudio'

  export let blockId: number;

  const didPlay = writable(false);
  const audioRequested = writable(false);
  let url:Writable<string> = writable('');

  $: isProcessing = !$url && $audioRequested;

  onMount(async (): Promise<any> => {
    const unsubscribe = page.subscribe(async ($page) => {
      if ($audioRequested) {
        const resp = await fetch(`/api/game/${$page.params.handle}/narrate`, {
          method: 'POST',
          body: JSON.stringify({ blockId }),
        });
        const data = await resp.json();
        url.set(data.url || '');
      }
    });

    return () => unsubscribe();
  });

  let audio: HTMLAudioElement | null = null;
  let state: any;
  let controls: any;

  if ($url) {
    [audio, state, controls] = useAudio($url) as [HTMLAudioElement, AudioState, AudioControls];
  } else {
    state = writable({
      playing: false,
      time: 0,
      duration: 0,
      buffered: [],
    });

    controls = {
      play: () => {},
      pause: () => {},
      seek: (time: number) => {},
    };
  }
  console.log('audio', audio, 'state', state, 'controls', controls);
  function handleClick() {
    didPlay.set(true);
    audioRequested.set(true);

    if (state.playing) {
      controls.pause();
    } else {
      controls.play();
    }
  }

  function handleRewind() {
    controls.seek(state.time - state.duration);
  }
</script>

<div class="flex gap-2 rounded-full border border-foreground/20">
  {#if audio}
    {@html audio}
  {/if}
  <Button
    variant="ghost"
    class="rounded-full"
    size="xs"
    alt="Play Narration"
    on:click={handleClick}
  >
    {#if state.playing}
      <PauseIcon size={8} />
    {:else if isProcessing}
      <LoaderIcon size={8} />
    {:else}
      <PlayIcon size={8} />
    {/if}
  </Button>
  {#if $didPlay}
    <Button
      variant="ghost"
      class="rounded-full"
      size="xs"
      alt="Rewind"
      on:click={handleRewind}
    >
      <RotateCcwIcon size={8} />
    </Button>
  {/if}
</div>