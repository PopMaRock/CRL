<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton'
	import { AppShell, Toast } from '@skeletonlabs/skeleton'
	//import { autoModeWatcher } from '@skeletonlabs/skeleton'
	//import type { LayoutData } from './$types'
	// Initialize
	//console.log("%cHello. There's nothing for cunts like you round these parts", style)
</script>

<div>
	<Modal />
	<Toast />

	<AppShell>
			<slot />
	</AppShell>
</div>
