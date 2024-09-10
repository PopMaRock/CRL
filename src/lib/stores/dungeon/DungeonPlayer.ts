import { writable, type Writable } from "svelte/store";

export const DungeonPlayerStore: Writable<DungeonPlayer> = writable();
//DungeonPlayer
const DungeonPlayerDefault: DungeonPlayer = {
    name: "",
    gender: "",
    visual: "",
    background: "",
    class: "",
    level: 1,
    xp: 0,
    nextLevel: 100,
    stats: [{ hp: 0, maxHp: 0, mp: 0, maxMp: 0 }],
    gold: 0,
    spells: [],
    inventory: [],
  };