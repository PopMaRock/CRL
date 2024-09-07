<script lang="ts">
	import GameIconsSideswipe from '~icons/game-icons/sideswipe'
	import { logicalPropertiesHorizontalSlide } from '$lib/utils/transitions'
	import { onMount } from 'svelte'
	import { SlideToggle } from '@skeletonlabs/skeleton'
	import { EngineLlmStore } from '$stores/engine'
	import { fade } from 'svelte/transition'
  import Button from '$components/Dungeon/Chat/button.svelte';
	//variable to manage open/close sidebar
	let srOpen = false
	let srDiv: any
	onMount(() => {
		const handleClickOutside = (event: any) => {
			if (srDiv && !srDiv.contains(event.target)) {
				srOpen = false
			}
		}
		window.addEventListener('click', handleClickOutside)
		return () => {
			window.removeEventListener('click', handleClickOutside)
		}
	})
	//FIXME: This is fucked. Fix it later. Shit is taking up too much time.
</script>

<div
	bind:this={srDiv}
	class="bg-surface-50-900-token grid h-full grid-cols-[auto_1fr] overflow-hidden border-l border-surface-500/30 {$$props.class ??
		''}"
>
	{#if srOpen}
		<section
			class="w-[23rem] space-y-4 overflow-y-auto p-4 pb-20"
			transition:logicalPropertiesHorizontalSlide={{ direction: 'inline', duration: 100 }}
		>
			<div class="mb-10 flex justify-between">
				<div id="open-close-btns" class="flex space-x-1">
					<button
						type="button"
						class="btn"
						title="Get the fuck back in"
						on:click={(event) => {
							event.stopPropagation()
							srOpen = false
						}}><GameIconsSideswipe class="rotate-180 text-xl text-primary-900" /></button
					>
				</div>

				<div id="app-name">
					<div class="flex flex-col leading-none">
						<div class="text-xl">Engine Settings</div>
					</div>
				</div>
			</div>
			Provider:<select class="select rounded-md" bind:value={$EngineLlmStore.llmActive}>
				<option value="lmstudio">LMStudio (Local)</option>
				<option value="openai">OpenAI</option>
			</select>
			<div transition:fade>
				{#if $EngineLlmStore.llm[$EngineLlmStore.llmActive]?.baseUrl}
				<div class="mb-2 mt-2">
					<label for="LLMbaseUrl">LLM URL:</label>
					<input
						type="text"
						name="LLMbaseUrl"
						class="input"
						bind:value={$EngineLlmStore.llm[$EngineLlmStore.llmActive].baseUrl}
					/>
				</div>
				{/if}
				<!--<div class="mb-2 mt-2">
					<label for="LLMAPIKey">API Key:</label>
					<input type="text" name="LLMAPIKey" class="input" value="" />
				</div>-->
				<div>
					<Button class="variant-filled-primary btn" on:click={() => {}}>Test Connect</Button>
				</div>
				<div class="mt-10">
					Streaming: <SlideToggle
						name="slide"
						bind:checked={$EngineLlmStore.llmTextSettings.stream}
					/>
				</div>
			</div>
		</section>
	{:else}
		<section>
			<button
				type="button"
				class="btn"
				on:click={(event) => {
					event.stopPropagation()
					srOpen = true
				}}><GameIconsSideswipe class="text-xl text-primary-900" /></button
			>
		</section>
	{/if}
</div>
