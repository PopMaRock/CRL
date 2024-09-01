<script lang="ts">
	//import Message from '$components/AIChatLayout/Message.svelte'
	import DynaBackground from '$components/DynaBackground.svelte'
	//import TypingIndicator from '$components/AIChatLayout/TypingIndicator.svelte'
	import { onMount } from 'svelte'
	import { AIDConversation } from '$stores/stores'
	import TextBlock from './Blocks/TextBlock.svelte'
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import { ArrowDown, ArrowRightIcon, LoaderIcon } from 'lucide-svelte'
	import Button from './button.svelte'
	import { useBackgroundMusic } from './useAudio' // Import the function
	import InteractionBox from './InteractionBox.svelte'
	export let response: any //this needs to constantly be passed around, like a country girl at a frat party.
	export let errorMessage = ''

	const inView = writable(true)
	const dispatch = createEventDispatcher()

	let scrollEndDiv: HTMLDivElement

	const scrollToBottom = () => {
		const container = document.getElementById('scroll-end-div')
		container?.scrollIntoView({ behavior: 'smooth' })
	}

	let selectedOption = 'do'
	let message = ''

	const { setUrl: setBackgroundMusicUrl } = useBackgroundMusic() // Destructure the setUrl function

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				inView.set(entry.isIntersecting)
			},
			{ threshold: 0.1 }
		)

		if (scrollEndDiv) {
			observer.observe(scrollEndDiv)
		}

		return () => {
			if (scrollEndDiv) {
				observer.unobserve(scrollEndDiv)
			}
		}
	})
	function dispatchMessage(e: Event) {
		e.preventDefault()
		if (message.length < 1) {
			errorMessage = 'Please enter a message.'
			return
		} else errorMessage = ''
		dispatch('sendMessage', { message, selectedOption })
	}
	function setMessage(value: string) {
		message = value
	}

	let formRef: HTMLFormElement
	let inputRef: HTMLTextAreaElement
	let input = ''
	let isLoading = false
	let agentHandle = ''
	let acceptsContinue = false
	let questId = ''
	let params = { handle: '' }
	let _acceptsInput = true
	let _showsContinue = true

	const handleSubmit = (e: Event) => {
		// Your handleSubmit logic here
	}

	const handleInputChange = (e: Event) => {
		// Your handleInputChange logic here
	}

	const setInput = (value: string) => {
		input = value
	}
	const advance = () => {
		// Your advance logic here
	}

	const amplitude = {
		track: (event: string, data: object) => {
			// Your amplitude tracking logic here
		}
	}
</script>

<div
id="quest-narrative-container"
class="h-[100dvh] max-w-6xl w-full flex flex-col flex-grow mx-auto pt-3 pb-6 px-4 overflow-hidden"
>
	<!--MAIN CONTAINER-->
	<!--///-->
	<div class="flex h-full overflow-hidden">
				<div
		  class="absolute top-0 left-0 right-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
		  aria-hidden="true"
		>
		  <div
			class="w-full h-full bg-gradient-to-br variant-gradient-primary-secondary opacity-10"
		  />
		</div>

		<!-- Content below only -->
		<!-- QuestNarrativeContainer -->
				<div class="relative w-full">
		  <main
			id="narrative-container"
			class="flex h-full w-full flex-col-reverse overflow-auto scroll-smooth justify-end"
		  >
				<div class="flex w-full flex-col gap-8 ">
					<!-- Messages -->
					<TextBlock
						blockId="1"
						offerAudio={false}
						text={'Once upon a time in la la land I took a jobby in the park...'}
						isPrior={false}
						wasAlreadyComplete={true}
					/>
					<TextBlock
						blockId="1"
						offerAudio={true}
						text={'Nobody at NASA gave a goddamn about the weather in Jersey. This fact, as true and as simple as it was, had not stopped my Aunt Rosie from pacing around the parlor all morning and pressing her face to the front window in search of thunderstorms. My mother had yelled at her for smearing rouge on the glass, and she, of course, had yelled right back. And soon, everybody was yelling. It was the day of my brother Eddie’s wedding, the day of the moon landing, and rain meant a lot of things. It meant a shower of good fortune, pouring out from'}
						isPrior={false}
						wasAlreadyComplete={false}
						didComplete={true}
					/>
					<!-- SCROLLPISH -->
					<div class="w-full" id="anchor">
						<div bind:this={scrollEndDiv} id="scroll-end-div" class="h-[1px] w-full" />
					</div>
					{#if !$inView}
						<Button
							on:click={scrollToBottom}
							variant="outline"
							class="absolute bottom-4 right-4 z-50 aspect-square rounded-full !p-2"
						>
							<ArrowDown size={16} />
						</Button>
					{/if}
					<!-- /SCROLLPISH -->
					<!-- End QuestNarrativeContainer -->
				</div>
				<!-- End Messages -->
			</main>
		</div>
	</div>
	<div class="relative mb-2 flex h-20 w-full flex-col items-end justify-center gap-2 pt-1">
			{#if _acceptsInput}
				<InteractionBox
					bind:formRef
					bind:inputRef
					handleSubmit={(e) => {
						advance()
						handleSubmit(e)
					}}
					{scrollToBottom}
					{input}
					{handleInputChange}
					{isLoading}
					{setInput}
					{agentHandle}
				/>
			{/if}
			{#if _showsContinue}
				<Button
					disabled={!acceptsContinue}
					on:click={() => {
						amplitude.track('Button Click', {
							buttonName: 'Continue',
							location: 'Quest',
							action: 'continue-quest',
							questId: questId,
							workspaceHandle: params.handle
						})
						advance()
						setTimeout(() => {
							scrollToBottom()
						}, 150)
					}}
					class="w-full"
				>
					Continue <ArrowRightIcon size={18} />
				</Button>
			{/if}
		</div>
	</div>
	<DynaBackground
		layers={{
			background: ['/dynabackground/background/mountain.png'],
			middleground: [],
			foreground: ['/dynabackground/foreground/mist.png']
		}}
	/>
<!--
<div class="relative flex h-screen max-h-[95vh] w-full overflow-hidden px-10 pt-10">
	<div class="flex-1 overflow-auto">
		<div class="react-scroll-to-bottom--css-ikyem-79elbk">
			<div class="react-scroll-to-bottom--css-ikyem-1n7m0yu">
				{#if showEmptyChat}
					<div class="relative flex w-full flex-col py-10">
						<h1
							class="flex h-screen items-center justify-center gap-2 text-center text-2xl font-semibold text-gray-200 dark:text-gray-600 sm:text-4xl"
						>
							AIDungeon2 Remastered
						</h1>
					</div>
				{/if}
				{#if !showEmptyChat && $AIDConversation.length > 0}
					<div class="flex flex-col text-sm">
						{#each $AIDConversation as item}
							<Message response={item} />
						{/each}
						{#if $response.loading}
							{#await new Promise((res) => setTimeout(res, 400)) then _}
								{#if $response.text == ''}
									<TypingIndicator />
								{:else}
									<Message response={$response.text} />
								{/if}
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
	.react-scroll-to-bottom--css-uzqrz-79elbk {
		position: relative;
	}

	.react-scroll-to-bottom--css-ikyem-1n7m0yu {
		height: 70%;
		overflow-y: auto;
		width: 100%;
	}

	textarea:focus {
		outline: none;
		box-shadow: none;
	}
</style>-->
