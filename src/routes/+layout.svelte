<script lang="ts">
  //import type { LayoutData } from './$types'
  import { autoModeWatcher, AppShell, initializeStores, Modal, storePopup } from "@skeletonlabs/skeleton";
  import { Toaster } from 'svelte-french-toast';
  import "../app.postcss";
  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
  } from "@floating-ui/dom";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  initializeStores();
</script>

<svelte:head>{@html "<script>(" +autoModeWatcher.toString() +")();</script>"}</svelte:head>
<div>
<!-- Rip out the skeleton modal as it strictly follows ARIA rules which are detrimental to development and fuck up functionality-->
<!-- thanks to the ARIA pish, the modal will always close when the backdrop is clicked. -->
  <Modal zIndex="z-[666]" on:backdrop={()=>{return undefined;}}/>
  <Toaster containerStyle="z-[999]"/>
  <AppShell>
    <slot />
  </AppShell>
</div>
