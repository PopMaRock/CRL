<script lang="ts">
  import RangeSlider from "$components/Base/FormElements/RangeSlider.svelte";
  import TextboxGroup from "$components/Base/FormElements/TextboxGroup.svelte";
  import { DungeonGameSettingsStore } from "$stores/dungeon/DungeonGameSettings";
  import { DungeonSd, fixedParams, sdSources } from "$stores/dungeon/DungeonSd";
  import {
    getForgeUpscalers,
    validateForgeUrl,
  } from "$utilities/stablediffusion/forge/api.controller";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { Check, CircleX } from "lucide-svelte";
  import { onMount } from "svelte";
  let upscalers: string[]; //array of upscalers
  let disabled = true;
  onMount(async () => {
    if (!$DungeonSd) {
      await DungeonSd.get($DungeonGameSettingsStore.game.id as string);
    }
    await checkForgeUrl();
  });
  async function checkForgeUrl() {
    $DungeonSd.forgeValidated = await validateForgeUrl();
    upscalers = await getForgeUpscalers();
    console.log(upscalers);
    if($DungeonSd.forgeValidated === true){
      disabled = false;
    }
  }
  $: disabled = !$DungeonSd.forgeValidated;
</script>
<div>
  <SlideToggle
    name="sd-prompt-gen"
    active="variant-filled-primary"
    title=""
    class="mt-2"
    size="sm"
    bind:checked={$DungeonSd.llmPromptGen}
    >LLM Prompt Generation is {$DungeonSd.llmPromptGen
      ? "enabled"
      : "disabled"}</SlideToggle
  >
</div>
<div class="mb-2">
  <SlideToggle
    name="sd-edit-before-gen"
    active="variant-filled-primary"
    title=""
    class="mt-2"
    size="sm"
    bind:checked={$DungeonSd.editBeforeGen}
    >Edit Before SD Generation is {$DungeonSd.editBeforeGen
      ? "enabled"
      : "disabled"}</SlideToggle
  >
</div>
<hr class="hr mb-4"/>
<select class="select rounded-md" bind:value={$DungeonSd.source}>
  {#each Object.entries(sdSources) as [key, source]}
    <option value={key}>{source.toUpperCase()}</option>
  {/each}
</select>
{#if $DungeonSd.source == "forge"}
  <div class="flex items-center">
    <TextboxGroup
      type="text"
      label="Forge URL"
      name="forgeUrl"
      title="Forge URL"
      class="!pl-0 !pt-0 "
      showTitle={false}
      bind:value={$DungeonSd.forgeUrl}
      iconHelp={true}
      helpText="The URL of the Forge server"
      helpIcon="help-circle"
    />
    <button class="btn rounded" on:click={checkForgeUrl}>
      {#if $DungeonSd.forgeValidated == true}<Check
          size={16}
          class="text-success-500"
        />
      {:else}<CircleX size={16} class="text-error-500" />
      {/if}
    </button>
  </div>
{/if}
<hr />
<div class="mt-2">
  <label for="hrUpscaler" class="label font-bold">Upscaler</label>
  <select {disabled} name="hrUpscaler" class="select rounded-md" placeholder="Hr Upscaler" bind:value={$DungeonSd.hrUpscaler}>
    {#if upscalers}
      {#each upscalers as upscaler}
        <option value={upscaler} selected={upscaler === $DungeonSd.hrUpscaler}
          >{upscaler}</option
        >
      {/each}
    {/if}
  </select>
</div>

<div class="grid grid-cols-2 gap-4 mt-4 mb-4">
  <RangeSlider
    title="Hr Scale"
    label="Hr Scale"
    name="hrScale"
    {disabled}
    bind:value={$DungeonSd.hrScale}
    min={fixedParams.hrScaleMin}
    max={fixedParams.hrScaleMax}
    step={fixedParams.hrScaleStep}
  />
  <RangeSlider
    title="Denoising Strength"
    label="Denoising Strength"
    name="denoisingStrength"
    {disabled}
    bind:value={$DungeonSd.denoisingStrength}
    max={fixedParams.denoisingStrengthMax}
    step={fixedParams.denoisingStrengthStep}
  />
</div>
<div>
    <RangeSlider
    title="Hires Steps"
    label="Hires Steps"
    name="hiresSteps"
    {disabled}
    bind:value={$DungeonSd.hrSecondPassSteps}
    max={fixedParams.hrSecondPassStepsMax}
    step={fixedParams.hrSecondPassStepsStep}
  />
  </div>
  <SlideToggle
    name="sd-hiresFixes"
    active="variant-filled-primary"
    title=""
    class="mt-2"
    size="sm"
    {disabled}
    bind:checked={$DungeonSd.enableHr}
    >Hires fixes are {$DungeonSd.enableHr
      ? "enabled"
      : "disabled"}</SlideToggle
  >
<hr class="hr mt-4 mb-4"/>
<TextboxGroup
  label="Common Positive Prompt"
  name="positivePrompt"
  type="text"
  {disabled}
  bind:value={$DungeonSd.positivePrompt}
  placeholder="Enter common positive prompts"
  iconHelp={true}
  helpText="Positive prompts will be attached to the front of the SD prompt"
  />
  <TextboxGroup 
  label="Common Negative Prompt"
  name="negativePrompt"
  type="text"
  {disabled}
  bind:value={$DungeonSd.negativePrompt}
  placeholder="Enter common negative prompts"
  iconHelp={true}
  helpText="Negative prompts will be attached to the front of the SD prompt"
  />
