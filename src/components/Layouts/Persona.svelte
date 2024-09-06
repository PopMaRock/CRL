<script lang="ts">

  import { Avatar } from "@skeletonlabs/skeleton";
  import type { ModalComponent, ModalSettings } from "@skeletonlabs/skeleton";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import PersonaSettings from "$components/Layouts/PersonaSettings.svelte";
  import { EnginePersonaStore } from "$stores/engine";

  const modalStore = getModalStore();
  async function openUserSettings() {
    const modal: ModalSettings = {
      type: "component",
      title: "Persona settings",
      component: {ref: PersonaSettings} as ModalComponent,
      // Returns the updated response value
      response: async () => {
        await EnginePersonaStore.setAndPersist();
      },
    };
    modalStore.trigger(modal);
  }
</script>
<button class="flex" title="User" on:click={openUserSettings}>
    <Avatar
        src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
        width="w-12"
        rounded="rounded-full"
    />
</button>