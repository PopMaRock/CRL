<script>
  import { cn } from "$lib/utils/utils";
  export let noTransform = false;
</script>

<!--
DO NOT REMOVE THIS INLINE TRANSFORMATION
For reasons unknown to me, adding this transformation fixes a bug on IOS Safari and chrome
where the scroll container would not auto-scroll to the newly added text. This keeps the user
from having to manually scroll to see the new text is added, while not preventing them
from scrolling up to see previous text.
-->
<div
  class={cn($$props.class)}
  style="transform: {noTransform ? 'none' : 'translateZ(0)'}"
>
  <slot></slot>
</div>