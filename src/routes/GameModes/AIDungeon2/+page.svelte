<script lang="ts">
	import { readablestreamStore } from '$lib/stores/ReadableStreamStore'
	import { Generator } from '$lib/AIGameModes/AIDungeon/Generator/Generator.class'
	import { AIDConversation } from '$stores/stores'
	import { onDestroy } from 'svelte'
	import StoryLayout from '$components/Chat/StoryLayout.svelte'

	const gen = new Generator()
	const response = readablestreamStore()
	let errorMessage = ''
	onDestroy(() => {
		console.log('destroyed AIDungeon2 session')
	})

	async function sendMessage(message: string, actionOption: string) {
		if ($response.loading) return //calm doon. Already doing something. Sake pal.
		//add the message to the conversation
		console.log('actionOption before generator', actionOption);
		if(!message && !actionOption) return;
		try {
			await gen.handleMessage(response, message, actionOption)
			console.log('Conversation up to now...', $AIDConversation)
		} catch (error: any) {
			console.error(error)
			errorMessage = error.message
		} finally {
			message = ''
		}
	}
	function handleSendMessage(event: any) {
		//shut the fuck up Typescript.
		const { message, actionOption } = event.detail
		sendMessage(message, actionOption)
	}
</script>

<StoryLayout {response} bind:errorMessage on:sendMessage={handleSendMessage} />
