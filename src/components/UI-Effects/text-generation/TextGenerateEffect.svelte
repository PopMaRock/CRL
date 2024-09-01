<script lang="ts">import { Motion } from "svelte-motion";
    import { cn } from "$components/UI-Effects/Utils/cn";
    export let words:string;
    export let className = void 0;
    export let delay = 0.1;
    export let duration = 1;
    const variants = {
      visible: (i:number) => ({
        opacity: 1,
        transition: {
          delay: i * delay,
          duration: duration
        }
      }),
      hidden: { opacity: 0 }
    };
    </script>
    
    <div class={cn('font-bold', className)}>
        <div class="mt-4">
            <div class=" text-2xl leading-snug tracking-wide text-black dark:text-white">
                <Motion let:motion custom={0} {variants} initial="hidden" animate={'visible'}>
                    <div use:motion>
                        {#each words.split(' ') as word, idx (`${word}${idx}`)}
                            <Motion let:motion {variants} custom={idx + 1} initial="hidden" animate={'visible'}>
                                <span use:motion class="text-black dark:text-white">
                                    {word}{' '}
                                </span>
                            </Motion>
                        {/each}
                    </div>
                </Motion>
            </div>
        </div>
    </div>