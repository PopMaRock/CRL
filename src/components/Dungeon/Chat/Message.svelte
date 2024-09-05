<script lang="ts">
	export let response: any

	// Function to wrap text within double quotes with <i> tags and wrap everything in a card
    function formatText() {
        if (response.content !== null && typeof response.content === 'string' && response?.role === "user") {
            let content = response.content;
            // Italicize quotes
            content = content.replace(/"([^"]*)"/g, 'You say <i>"$1"</i>');
            if(content.startsWith(">"))
                content = content.replace(/>/g, 'You ');
            // Wrap in a card
            return `
                <div class="card pl-25 p-2 rounded-tr-none space-y-1 variant-ghost-surface-500" style="width: 100%;
    height: fit-content;
    justify-content: flex-start;
    margin: 0;">
                    <p>${content}</p>
                </div>
            `;
        }
            return response?.content;
    }
</script>

<div class="group w-full">
		<div class="flex flex-grow flex-col">
			<div class="flex flex-col items-start whitespace-pre-line break-words">
				<div class="reduced-line-height prose w-full break-words text-surface-200">
					{#if response === null}
						Tb Cursor
					{:else}
						<p>{@html response?.role ? formatText() : response}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

<style>
	.reduced-line-height {
		line-height: 1.5; /* Adjust this value as needed */
	}
</style>
