<script lang="ts">
  import { initializeStores, Modal, storePopup } from "@skeletonlabs/skeleton";
  import { AppShell, Toast } from "@skeletonlabs/skeleton";
  //import type { LayoutData } from './$types'
  import { autoModeWatcher } from "@skeletonlabs/skeleton";
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
  <Toast zIndex="z-[999]"/>

  <AppShell>
    <slot />
  </AppShell>
</div>
