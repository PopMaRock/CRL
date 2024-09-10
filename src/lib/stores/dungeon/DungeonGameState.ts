import { writable, type Writable } from "svelte/store";

export const DungeonGameStateStore: Writable<any> = writable({
    lootBox: [],
    placeAndTime: {},
    shop: [],
    choices: [],
    enemy: {},
    event: { inCombat: false, shopMode: null, lootMode: false },
    meta: {
      created: Date.now(),
      lastPlay: Date.now(),
    },
  });

  //DungeonGameState
const DungeonGameStateDefault: DungeonGameState = {
  lootBox: [],
  placeAndTime: {},
  shop: [],
  choices: [],
  enemy: {},
  gameEvent: { inCombat: false, shopMode: null, lootMode: false },
  meta: {
    created: Date.now(),
    lastPlay: Date.now(),
  },
};