<script lang="ts">
	import { cn } from '$lib/utils/utils'
	import { get, writable } from 'svelte/store'
	import NarrationPlayer from '../NarrationPlayer.svelte'
	import BlockContainer from './BlockContainer.svelte'
	import TextGenerateEffect from '$components/UI-Effects/text-generation/TextGenerateEffect.svelte'
	import { fade } from 'svelte/transition'
	import { onDestroy, onMount } from 'svelte'
	import { DungeonConversationStore } from '$stores/dungeon'

	export let item: DungeonConversation | string
	export let blockId: number = 0
	export let offerAudio: boolean = false
	export let fadein: boolean = false
	const isHover = writable(false)
	function formatText() {
		if (typeof item == 'string') return
		if (item.content !== null && typeof item.content === 'string' && item?.role == 'user') {
			let content = item.content
			// Italicize quotes
			content = content.replace(/"([^"]*)"/g, 'You say <i>"$1"</i>')
			if (content.startsWith('>')) content = content.replace(/>/g, 'You ')
			// Wrap in a card
			return `<blockquote class="blockquote font-smoothing text-lg">${content}</blockquote>`
		} else {
			return item?.content
		}
	}
	let isEditing = false
	let inputValue = ''
	let content = ''
	// Get the initial content
	// Get the initial content if item is not a string
	$: if (typeof item !== 'string') {
		const conversation = get(DungeonConversationStore)[blockId]
		if (conversation && conversation.content !== undefined) {
			content = conversation.content
		}
	}

	// Function to enable editing
	function enableEditing() {
		isEditing = true
		inputValue = content
		setTimeout(() => {
			const textarea = document.querySelector(`#textarea-${blockId}`)
			if (textarea) {
				adjustTextareaHeight(textarea)
				//textarea.focus() -- doesn't exist on textarea
			}
		}, 0)
	}
	// Function to adjust the height of the textarea
	function adjustTextareaHeight(textarea: any) {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}
	// Function to save the changes
	function saveChanges() {
		DungeonConversationStore.update((conversations) => {
			conversations[blockId].content = inputValue
			return conversations
		})
		isEditing = false
	}

	// Function to handle click outside
	function handleClickOutside(event: any) {
		if (isEditing && !event.target.closest('.editable')) {
			saveChanges()
		}
	}
	// Add event listener for clicks outside
	onMount(() => {
		document.addEventListener('click', handleClickOutside)
	})
	// Remove event listener on destroy
	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside)
	})
</script>

<BlockContainer>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:mouseenter={() => {
			if (typeof item !== 'string' && item?.role !== 'user') isHover.set(true)
		}}
		on:mouseleave={() => {
			if (typeof item !== 'string' && item?.role !== 'user') isHover.set(false)
		}}
	>
		<div
			id={`chatMessage${blockId}`}
			class={cn('text-normal whitespace-pre-wrap rounded-md', $isHover && 'bg-sky-300/10')}
		>
			<p transition:fade={{ delay: 150, duration: 150 }} class="chat-text font-smoothing">
				{#if typeof item !== 'string'}
					{#if isEditing}
						<!--<textarea> is given a unique ID to ensure the correct element is targeted for editing height adjustment -->
						<textarea
							id={`textarea-${blockId}`}
							bind:value={inputValue}
							class="editable"
							on:blur={saveChanges}
							on:input={(event) => adjustTextareaHeight(event.target)}
						></textarea>
					{:else}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span class="editable" on:click={enableEditing}>
							{#if fadein}
								<TextGenerateEffect words={content} />
							{:else}
								{content}
							{/if}
						</span>
					{/if}
				{:else}
					<span>{@html item}</span>
				{/if}
			</p>
		</div>
		{#if blockId && offerAudio && typeof item !== 'string'}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				id="chatMessageNarrationPlayer{blockId}"
				class="flex w-full items-center justify-center"
				style="min-height: 27px;"
			>
				{#if $isHover}
					<div class="flex w-full items-center justify-center" transition:fade>
						<div class="border-foreground/20 flex-grow border-t px-2" />
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="px-2" transition:fade>
							<NarrationPlayer {blockId} />
						</div>
						<div class="border-foreground/20 flex-grow border-t px-2" />
					</div>
				{/if}
			</div>
		{/if}
	</div>
</BlockContainer>

<style type="postcss">
	.editable {
		width: 100%;
		font-size: inherit;
		font-family: inherit;
		line-height: inherit;
		padding: 0;
		margin: 0;
		border: none;
		background: none;
		resize: none;
		overflow: hidden;
	}
	.editable:focus {
		outline: none;
	}
	.fade-in {
		animation: fadeIn 0.5s ease-in-out;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
