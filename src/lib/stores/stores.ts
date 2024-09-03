import { writable, type Writable } from 'svelte/store'

export const ui: any = writable({ errorWarnMsg: '', buyWarnMsg: '', sellWarnMsg: '' })
//hem combat, hem sell, hem de (emin olduktan sonra) buy için kullanılabilir galiba
export const selectedItem: any = writable({})
export const coolDowns: any = writable({})
export const descWindow: any = writable({
	name: undefined,
	damage: undefined,
	type: undefined,
	healing: undefined,
	mana: undefined,
	armor: undefined,
	element: undefined,
	weaponClass: undefined,
	manaCost: undefined,
	price: undefined,
	amount: undefined,
	point: undefined
})
//---
