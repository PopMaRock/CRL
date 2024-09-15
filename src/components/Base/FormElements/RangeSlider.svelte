<script lang="ts">
  import { RangeSlider } from "@skeletonlabs/skeleton";
  export let value: number;
  export let min=0;
  export let max = 0;
  export let step = 0.1;
  export let name = "";
  export let label = "";
  export let title = "";
  export let disabled = false;
</script>

<div {title} >
  <RangeSlider {disabled} {name} bind:value={value} {max} {min} {step} ticked>
    <div class="flex justify-between items-center">
      <div class="font-bold" {title}>{label}</div>
      <div class="text-xs">
        {value} / {max}
      </div>
    </div>
  </RangeSlider>
</div>
