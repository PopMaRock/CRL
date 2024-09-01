<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import SuggestionSheet from './SuggestionSheet.svelte' // Adjust the import based on your file structure
	import { LoaderIcon, MoveLeft, PencilIcon, SendIcon } from 'lucide-svelte'
	import Button from './button.svelte'
	export let formRef: HTMLFormElement
	export let inputRef: HTMLTextAreaElement
	export let handleSubmit: (e: Event) => void
	export let scrollToBottom: () => void
	export let input: string
	export let handleInputChange: (e: Event) => void
	export let isLoading: boolean
	export let setInput: (value: string) => void
	export let agentHandle: string | null = null

	const selectedOption = writable<'none' | 'custom'>('none')

	const dispatch = createEventDispatcher()

	const track = (event: string, data: object) => {
		dispatch(event, data)
	}

	const handleFormSubmit = (e: Event) => {
		e.preventDefault()
		e.stopPropagation()
		inputRef?.focus()
		track('Send Message', {
			location: 'Quest'
		})
		handleSubmit(e)
		scrollToBottom()
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			formRef?.requestSubmit()
		}
	}
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
			<SuggestionSheet {setInput} {agentHandle} setSelectedOption={()=>{}} disabled={isLoading} />
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
		<form bind:this={formRef} class="flex w-full gap-2" on:submit={handleFormSubmit}>
			<textarea
				class="w-full resize-none py-[.6rem]"
				bind:value={input}
				on:input={handleInputChange}
				bind:this={inputRef}
				on:keydown={handleKeyDown}
				disabled={isLoading}
				autofocus
			/>
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
