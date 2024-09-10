import { writable, type Writable } from "svelte/store";

export const DungeonCharacterStore: Writable<any> = writable({
    characters: [],
  });