<script lang="ts">
	import Message from '$components/Dungeon/Chat/Message.svelte'
	import DynaBackground from '$components/Layouts/dungeon/DynaBackground.svelte'
	import TypingIndicator from '$components/Layouts/dungeon/Chat/TypingIndicator.svelte'
	import { onMount, afterUpdate } from 'svelte'
    import { DungeonConversationStore } from '$stores/dungeon'
    import {createEventDispatcher} from 'svelte'
    export let response: any; //this needs to constantly be passed around, like a country girl at a frat party.
    export let errorMessage = '';
    
	let showEmptyChat = false;
	let textAreaRef: any = null;
	let bottomOfChatRef: HTMLDivElement;
    let selectedOption = 'do';
    let message = '';
    
    const dispatch = createEventDispatcher();
	$: {
		if (textAreaRef) {
			textAreaRef.style.height = '24px'
			textAreaRef.style.height = `${textAreaRef.scrollHeight}px`
		}
	}
	onMount(async () => {
		if (textAreaRef) {
			textAreaRef.style.height = '24px'
			textAreaRef.style.height = `${textAreaRef.scrollHeight}px`
		}
	})
	afterUpdate(() => {
		if (textAreaRef) {
			textAreaRef.style.height = '24px'
			textAreaRef.style.height = `${textAreaRef.scrollHeight}px`
		}
		if (bottomOfChatRef) {
			bottomOfChatRef.scrollIntoView({ behavior: 'smooth' })
		}
	})
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement
		setMessage(target.value ?? '')
	}
	function handleKeypress(e: KeyboardEvent) {
		if (e.keyCode == 13 && !e.shiftKey) {
			dispatchMessage(e);
		}
	}
    function dispatchMessage(e: Event) {
        e.preventDefault()
        if (message.length < 1) {
			errorMessage = 'Please enter a message.'
			return
		} else errorMessage = ''
        dispatch('sendMessage', { message, selectedOption });
    }
	function setMessage(value: string) {
		message = value
	}
</script>

<div class="relative flex h-screen max-h-[95vh] w-full overflow-hidden px-10 pt-10">
	<div class="flex-1 overflow-auto">
		<div>
			<div>
				{#if showEmptyChat}
					<div class="relative flex w-full flex-col py-10">
						<h1
							class="flex h-screen items-center justify-center gap-2 text-center text-2xl font-semibold text-gray-200 dark:text-gray-600 sm:text-4xl"
						>
							AIDungeon2 Remastered
						</h1>
					</div>
				{/if}
				{#if !showEmptyChat && $DungeonConversationStore.length > 0}
					<div class="flex flex-col text-sm">
						{#each $DungeonConversationStore as item}
							<Message response={item} />
						{/each}
						{#if $response.loading}
							{#await new Promise((res) => setTimeout(res, 400)) then _}
								{#if $response.text == ''}
									<TypingIndicator />
								{:else}
									<Message response={$response.text} />
								{/if}
								<!--{#if $response.text != ''}
                            <div class="w-2" />
                            <div class="m-1 w-4">
                                <svg
                                    class="h-4 w-4 animate-spin text-neutral-600 dark:text-neutral-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    />
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                        {/if}-->
							{/await}
						{/if}
						<div class="h-32 w-full flex-shrink-0 md:h-48"></div>
						<div bind:this={bottomOfChatRef}></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div
		class="md:bg-vert-light-gradient dark:md:bg-vert-dark-gradient absolute bottom-0 left-0 w-full border-t bg-white pt-2 dark:border-white/20 dark:bg-gray-800 md:border-t-0 md:border-transparent md:!bg-transparent md:dark:border-transparent"
	>
		<form
			class="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:max-w-3xl xl:max-w-3xl"
		>
			<div class="relative flex flex-1 flex-col items-stretch md:flex-col">
				{#if errorMessage}
					<div class="mb-2 md:mb-0">
						<div class="ml-1 flex justify-center gap-0 md:m-auto md:mb-2 md:w-full md:gap-2">
							<span class="text-sm text-red-500">{errorMessage}</span>
						</div>
					</div>
				{/if}
				<div
					class="w-full flex-grow flex-col rounded-md border border-black/10 py-2 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-gray-700 dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] md:py-3 md:pl-4"
				>
					<div class="flex">
						<select
							bind:value={selectedOption}
							class="mr-2 rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
						>
							<option value="do">Do</option>
							<option value="say">Say</option>
							<option value="story">Story</option>
						</select>
						<textarea
							bind:this={textAreaRef}
							bind:value={message}
							tabIndex={0}
							data-id="root"
							placeholder={selectedOption == 'do'
								? 'What do you do?'
								: selectedOption == 'say'
									? 'What do you say?'
									: selectedOption == 'story'
										? 'What happens next?'
										: 'What do you see?'}
							class="m-0 h-6 max-h-[200px] w-full resize-none overflow-y-hidden border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
							on:input={handleInput}
							on:keydown={handleKeypress}
						></textarea>
						<button
							disabled={$response.loading || message.length === 0}
							on:click={dispatchMessage}
							class="variant-filled-primary btn absolute bottom-1.5 right-1 rounded-md bg-transparent p-1 disabled:bg-gray-500 disabled:opacity-40 md:bottom-2.5 md:right-2"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
	<DynaBackground
		layers={{
			background: ['/dynabackground/background/mountain.png'],
			middleground: [],
			foreground: ['/dynabackground/foreground/mist.png']
		}}
	/>
</div>

<style>
	textarea:focus {
		outline: none;
		box-shadow: none;
	}
</style>
