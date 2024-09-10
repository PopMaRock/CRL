<script lang="ts">
	import { writable } from 'svelte/store'
	import { SparklesIcon } from 'lucide-svelte'
	import Alert from './Alert.svelte' // Adjust the import based on your file structure
	import Skeleton from './Skeleton.svelte' // Adjust the import based on your file structure
	import Button from '../../Base/FormElements/button.svelte'

	export let setSelectedOption: (value: string) => void
	export let setInput: (value: string) => void
	export let agentHandle: string | null = null
	export let disabled: boolean

	const isLoading = writable(false)
	const suggestions = writable<string[]>([])
	const error = writable(false)

	const fetchSuggestionsApi = async () => {
		const response = await fetch(`/api/agent/${agentHandle}/suggestAction`, {
			method: 'POST'
		})
		const choices = await response.json()
		return choices
	}

	const getSuggestions = async () => {
		isLoading.set(true)
		suggestions.set([])
		const s = await fetchSuggestionsApi()
		if (Array.isArray(s)) {
			suggestions.set(s)
			error.set(false)
		} else {
			error.set(true)
		}
		isLoading.set(false)
	}
</script>


		<Button variant="outline" class="flex w-full gap-4" {disabled} on:click={getSuggestions}>
			<SparklesIcon class="h-5" /> Suggest
		</Button>
			{#if $error}
				<Alert>
					This Adventure does not support suggestions.<br/>
						You'll need to type your own message or encourage the author to update their adventure.
				</Alert>
			{:else}
				<div class="flex w-full flex-col items-center justify-center">
					&nbsp; <!-- What do you want to do next? -->

					{#if $isLoading}
						<div class="flex h-full max-w-lg flex-col gap-4">
							<Skeleton class="h-10 w-full" />
							<Skeleton class="h-10 w-full" />
							<Skeleton class="h-10 w-full" />
						</div>
					{/if}
					<div class="flex h-full max-w-lg flex-col gap-4">
						{#each $suggestions as suggestion, i}
							<Button
								on:click={() => {
									setInput(suggestion)
									setSelectedOption('custom')
								}}
								key={i}
								variant="outline"
								class="h-full"
							>
								{suggestion}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
