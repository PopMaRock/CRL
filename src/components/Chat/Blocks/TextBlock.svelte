<script lang="ts">
	import { addNewlines } from '../tempUtil'
	import { cn } from '$lib/utils/utils'
	import { Loader } from 'lucide-svelte'
	import { onMount, createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import NarrationPlayer from '../NarrationPlayer.svelte'
	import BlockContainer from './BlockContainer.svelte'

	export let text: string = ''
	export let blockId: string = ''
	export let offerAudio: boolean = false
	export let didComplete: boolean = false
	export let wasAlreadyComplete: boolean = false
	export let isPrior: boolean = false

	const isHover = writable(false)
	const currentChunkIndex = writable(0)
	const chunks = writable<string[]>([])
	const chunkSize = 5
	const delay = 50

	const _text = addNewlines(text)

	const dispatch = createEventDispatcher()
	onMount(() => {
		if (!wasAlreadyComplete && $currentChunkIndex < text.length) {
			const interval = setInterval(() => {
				const nextChunkEnd = Math.min($currentChunkIndex + chunkSize, text.length)
				const nextChunk = text.substring($currentChunkIndex, nextChunkEnd)
				chunks.update((prevChunks) => [...prevChunks, nextChunk])
				currentChunkIndex.set(nextChunkEnd)
				if (nextChunkEnd >= text.length) {
					dispatch('finishedRendering')
					clearInterval(interval)
				}
			}, delay)

			return () => clearInterval(interval)
		}
	})
</script>
<BlockContainer>
	<div
		data-blocktype="text-block"
		class={cn('text-normal whitespace-pre-wrap rounded-md', $isHover && 'bg-sky-300/10')}
	>
		{#if !text}
			<Loader class="animate-spin" />
		{:else if !isPrior}
			{#if wasAlreadyComplete}
				<span class="fadeIn story-text">{text}</span>
			{:else}
				<div>
					{#each $chunks as chunk, index}
						<span class="fadeIn story-text">{chunk}</span>
					{/each}
				</div>
			{/if}
		{:else}
			<span>{_text}</span>
		{/if}
	</div>
	{#if blockId && offerAudio && didComplete}
		<div class="mt-2 flex w-full items-center justify-center">
			<div class="w-full px-2">
				<div class="border-foreground/20 w-full border-t px-2" />
			</div>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div on:mouseenter={() => isHover.set(true)} on:mouseleave={() => isHover.set(false)}>
				<NarrationPlayer {blockId} />
			</div>
			<div class="w-full px-2">
				<div class="border-foreground/20 w-full border-t px-2" />
			</div>
		</div>
	{/if}
</BlockContainer>

<style type="postcss">
	.fadeIn {
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


