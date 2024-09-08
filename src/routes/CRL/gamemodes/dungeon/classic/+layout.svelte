<script lang="ts">
  import { Modal } from "@skeletonlabs/skeleton";
  import { AppShell, Toast } from "@skeletonlabs/skeleton";
  import type { LayoutData } from "./$types";
  import { navigating } from '$app/stores';
  import { fly } from "svelte/transition";
  export let data: LayoutData;
  //import { autoModeWatcher } from '@skeletonlabs/skeleton'
  //import type { LayoutData } from './$types'
  // Initialize
  //console.log("%cHello. There's nothing for cunts like you round these parts", style)
</script>

<div>
  <Modal />
  <Toast />

  <AppShell>
    <!-- Page Content -->
	{#key data.url}
	<div in:fly={{ x: -200, duration: 300, delay: 300 }} out:fly={{ x: 200, duration: 300 }}>
		{#if $navigating}
			<!-- LOOK HERE -->
			<div class="m-8">
				<h1 class="text-3xl text-center text-cText">L O A D I N G...</h1>
			</div>
		{:else}
			<slot />
		{/if}
	</div>
{/key}
  </AppShell>
</div>
