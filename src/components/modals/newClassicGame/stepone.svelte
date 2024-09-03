<script lang="ts">
	import { cn } from '$utilities/utils'
    import { getModalStore } from '@skeletonlabs/skeleton'
	import type { SvelteComponent } from 'svelte'
    /** Exposes parent props to this component. */
	export let parent: SvelteComponent;

    const modalStore = getModalStore()
    if ($modalStore[0]) console.log($modalStore[0].title);

    // Base Classes
	const cBase = 'p-4 shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
<div class={cn(cBase, 'w-model-wide min-w-[90vh] min-h-[60vh] flex flex-col')}>
    <header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
    <article class="flex-grow">{$modalStore[0].body ?? '(body missing)'}</article>
    <footer class={cn('modal-footer', parent.regionFooter)}>
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={null}>{parent.buttonTextSubmit}</button>
    </footer>
</div>
{/if}