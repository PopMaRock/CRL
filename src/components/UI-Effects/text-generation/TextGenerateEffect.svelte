<script lang="ts">
	import { Motion } from 'svelte-motion'
	export let words: string
	export let delay = 0.1
	export let duration = 1
	const variants = {
		visible: (i: number) => ({
			opacity: 1,
			transition: {
				delay: i * delay,
				duration: duration
			}
		}),
		hidden: { opacity: 0 }
	}
</script>

{#each words.split(' ') as word, idx (`${word}${idx}`)}
	<Motion let:motion {variants} custom={idx + 1} initial="hidden" animate={'visible'}>
		<span class="p-0 m-0" use:motion>
			{word}
		</span>
	</Motion>
{/each}
