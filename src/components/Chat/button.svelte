<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cn } from '$lib/utils/utils';

  export let isLoading: boolean = false;
  export let variant: string = 'default';
  export let size: string = 'default';
  export let className: string = '';
  export let type: any = 'button';
  export let disabled: boolean = false;
  export let alt: string = '';

  const dispatch = createEventDispatcher();

  const baseClasses: string = $$props.class+" inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizeClasses: Record<string, string> = {
    default: "h-10 px-4 py-2",
    xs: "h-6 rounded-md px-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  $: buttonClass = cn(
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    className
  );
</script>

<svelte:options customElement="button-component" />

<button
  class={buttonClass}
  type={type}
  disabled={disabled}
  on:click={() => dispatch('click')}
  aria-label={alt}
  title={alt}
>
  {#if isLoading}
    <div
      class="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-primary-foreground rounded-full"
      role="status"
      aria-label="loading"
    >
      <span class="sr-only">Loading...</span>
    </div>
  {:else}
    <slot></slot>
  {/if}
</button>