<script lang="ts">
  export let variant: 'default' | 'warn' | 'info' | 'destructive' = 'default';
  export let props: Record<string, any> = {};

  // Utility function to concatenate class names
  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const alertVariants = {
    default: "bg-background text-foreground",
    warn: "bg-yellow-500 border-yellow-500 text-background",
    info: "bg-blue-500 border-blue-500 text-background",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  };
</script>

<div
  role="alert"
  class={cn(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    alertVariants[variant],
    $$props.class
  )}
  {...props}
><slot/></div>