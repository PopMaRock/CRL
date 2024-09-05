import { writable } from 'svelte/store';

export interface AudioState {
  playing: boolean;
  time: number;
  duration: number;
  buffered: TimeRange[];
}

export interface AudioControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}

export interface TimeRange {
  start: number;
  end: number;
}

// Define the writable stores
export const isOffered = writable(false);
export const isActive = writable(false);
export const url = writable('');

// Define the useAudio function
export function useAudio(audioUrl: string): [HTMLAudioElement | null, any, any] {
  let audio: HTMLAudioElement | null = null;
  if (typeof Audio !== 'undefined') {
    audio = new Audio(audioUrl);
  }

  const state = writable<AudioState>({
    playing: false,
    time: 0,
    duration: 0,
    buffered: [],
  });

  const controls: AudioControls = {
    play: () => {
      if (audio) {
        audio.play();
        state.update(s => ({ ...s, playing: true }));
      }
    },
    pause: () => {
      if (audio) {
        audio.pause();
        state.update(s => ({ ...s, playing: false }));
      }
    },
    seek: (time: number) => {
      if (audio) {
        audio.currentTime = time;
        state.update(s => ({ ...s, time }));
      }
    },
  };

  if (audio) {
    audio.addEventListener('timeupdate', () => {
      state.update(s => ({ ...s, time: audio.currentTime }));
    });

    audio.addEventListener('durationchange', () => {
      state.update(s => ({ ...s, duration: audio.duration }));
    });

    audio.addEventListener('progress', () => {
      const buffered: TimeRange[] = [];
      for (let i = 0; i < audio.buffered.length; i++) {
        buffered.push({ start: audio.buffered.start(i), end: audio.buffered.end(i) });
      }
      state.update(s => ({ ...s, buffered }));
    });
  }

  return [audio, state, controls];
}

// Define the function to return the stores and their setters
export const useBackgroundMusic = () => {
  return {
    isOffered,
    isActive,
    setIsActive: isActive.set,
    setIsOffered: isOffered.set,
    url,
    setUrl: url.set,
  };
};