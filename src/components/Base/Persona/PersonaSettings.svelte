<script lang="ts">
  import { onMount, tick } from "svelte";
  import Modal from "../ModalTemplate.svelte";
  import TextboxGroup from "$components/Base/FormElements/TextboxGroup.svelte";
  import Textarea from "$components/Base/FormElements/Textarea.svelte";
  import { EnginePersonaStore } from "$stores/engine/EnginePersona";
  export let parent: any; //shite passed from the parent component. It'll complain if it's removed.

  onMount(async () => {
    console.log("User Settings");
    await EnginePersonaStore.get(); //should get the data from the database
  });

  async function savePersona() {
    EnginePersonaStore.setAndPersist();
  }
</script>

<Modal
  title="User Persona"
  showFooterButtons={false}
  showBackButton={false}
  class="min-h-[40vh] w-[60vh]"
  on:close={async () => {
    await tick();
    await savePersona();
  }}
>
  <TextboxGroup
    name="persona"
    label="Persona"
    type="text"
    bind:value={$EnginePersonaStore.persona}
  />
  <Textarea
    name="personaDesc"
    label="Persona Description"
    title="Enter a description for your persona"
    bind:value={$EnginePersonaStore.personaDesc}
    placeHolder={"Example: %personaName% is a 25 year old Scottish male goth maniac with a twitch and short temper"}
  />
</Modal>
