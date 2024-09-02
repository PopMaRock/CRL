import { writable, type Writable } from "svelte/store";


export const CRLSettingsStore:Writable<any> = writable({stream:false});