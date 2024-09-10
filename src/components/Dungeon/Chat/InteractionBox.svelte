<script lang="ts">
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import SuggestionSheet from './SuggestionSheet.svelte' // Adjust the import based on your file structure
	import { LoaderIcon, MoveLeft, PencilIcon, SendIcon } from 'lucide-svelte'
	import Button from '../../Base/FormElements/button.svelte'
	export let input: string
	export let isLoading: boolean
	export let setInput: (value: string) => void
	export let agentHandle: string | null = null

	let inputRef: HTMLTextAreaElement
	const selectedOption = writable<'none' | 'custom'>('none')
	let actionOption = 'do'
	const dispatch = createEventDispatcher()

	const handleFormSubmit = (e: Event) => {
		e.preventDefault()
		e.stopPropagation()
		inputRef?.focus()
		dispatch('sendMessage', { message: input, selectedOption: actionOption })
		input = '' //clear input.
	}
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			handleFormSubmit(e)
		}
	}
	function adjustHeight() {
		if (inputRef) {
			inputRef.style.height = '70px'
			inputRef.style.height = `${inputRef.scrollHeight}px`
		}
	}
	$: adjustHeight()
	onMount(() => {
		adjustHeight()
	})
	afterUpdate(() => {
		adjustHeight()
	})
</script>

<div class="flex w-full flex-col">
	{#if $selectedOption !== 'none' && !isLoading}
		<div class="flex gap-2">
			<button
				class="mb-2 flex items-center gap-2 text-sm"
				on:click={() => selectedOption.set('none')}
			>
				<MoveLeft class="h-4" /> View Options
			</button>
		</div>
	{/if}
	{#if $selectedOption === 'none'}
		<div class="flex w-full gap-2">
			<SuggestionSheet {setInput} {agentHandle} setSelectedOption={() => {}} disabled={isLoading} />
			<Button
				variant="outline"
				class="flex w-full gap-4"
				on:click={() => selectedOption.set('custom')}
				disabled={isLoading}
			>
				<PencilIcon class="h-5" /> Custom
			</Button>
		</div>
	{/if}
	{#if $selectedOption === 'custom'}
				<form class="flex w-full gap-2" on:submit={handleFormSubmit}>
		  <div class="relative w-full h-[70px]">
			<select
			  bind:value={actionOption}
			  class="absolute bottom-0 left-0 mb-2 ml-2 z-10 rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
			>
			  <option value="do">Do</option>
			  <option value="say">Say</option>
			  <option value="story">Story</option>
			</select>
			<!-- svelte-ignore a11y-autofocus -->
			<textarea
			  class="textarea m-0 h-[70px] w-full resize-none overflow-y-hidden rounded-md border-0 py-[.6rem] pl-3 pr-7 focus:ring-0 focus-visible:ring-0"
			  bind:value={input}
			  bind:this={inputRef}
			  on:keydown={handleKeyDown}
			  disabled={isLoading}
			/>
		  </div>
		  <Button type="submit" disabled={isLoading}>
			{#if isLoading}
			  <LoaderIcon size={16} class="animate-spin" />
			{/if}
			{#if !isLoading}
			  <SendIcon size={16} />
			{/if}
		  </Button>
		</form>
	{/if}
</div>

<style>

	textarea:focus {
		outline: none;
		box-shadow: none;
	}
</style>
