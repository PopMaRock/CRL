<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "../ModalTemplate.svelte";
  import { EnginePersonaStore } from "$stores/engine";
  import TextboxGroup from "$components/Main/Forms/TextboxGroup.svelte";
  import Textarea from "$components/Main/Forms/Textarea.svelte";

  onMount(async () => {
    console.log("User Settings");
    await EnginePersonaStore.get(); //should get the shit from the database
  });
</script>

<Modal
  title="User Persona"
  showFooterButtons={false}
  showBackButton={false}
  class="min-h-[40vh] w-[60vh]"
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
