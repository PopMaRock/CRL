<script lang="ts">
  export let props: Record<string, any> = {};

  // Utility function to concatenate class names
  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
</script>

<div
  class={cn("animate-pulse rounded-md bg-muted", $$props.class)}
  {...props}
/>