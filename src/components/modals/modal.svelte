<script lang="ts">
	import { cn } from '$utilities/utils'
	import { Icon, XIcon } from 'lucide-svelte'
	import { createEventDispatcher } from 'svelte'
	export let title: string = ''
	export let width: string = '60vh'
	export let maxHeight: string = '70vh'
	const dispatch = createEventDispatcher()
	//--
</script>

<div
	class={cn(
		`w-model card variant-ghost-surface flex min-h-[60vh] min-w-[60vh] transform overflow-y-auto rounded-md shadow-xl transition-all sm:w-full sm:p-6`,
		`${$$props.class} min-w-[${width}];max-h-[${maxHeight}]`
	)}
>
	<header class="flex items-center border-b dark:border-gray-700" id="modal-title">
		<!-- {#if icon} 
                <Fa icon={icon} class="mr-3 p-0" size="4x" />
                {/if}-->
		<div class="ml-1 text-xl font-semibold">{title}</div>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => {
				dispatch('close')
			}}
			class="ml-auto rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
		>
			<Icon src={XIcon} class="h-5 w-5" />
		</div>
	</header>
	<article>
		<div class="mt-5 flex w-full items-center">
			<slot />
		</div>
	</article>
</div>
