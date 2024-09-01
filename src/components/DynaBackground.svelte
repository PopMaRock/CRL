<script lang="ts">
    export let layers: any = {
        background: [],
        middleground: [],
        foreground: []
    }

    let video1: HTMLVideoElement

    function handleVideoEnd() {
        video1.pause()
        let currentTime = video1.currentTime
        let reverseDuration = 3 // seconds
        let reverseEndTime = currentTime - reverseDuration
        let reverseInterval = setInterval(() => {
            currentTime -= 0.1
            if (currentTime <= reverseEndTime) {
                clearInterval(reverseInterval)
                video1.currentTime = currentTime
                video1.play()
            } else {
                video1.currentTime = currentTime
            }
        }, 100)
    }
</script>


<div class="max-h-4xl relative relative max-w-4xl">
    <section class="relative z-5 h-full w-full mix-blend-multiply">
        <div class="h-full w-full">
            {#each layers.background as src}
                <img {src} alt="Background" class="absolute inset-0 z-10 h-full w-full object-contain" />
            {/each}
            {#each layers.middleground as src}
                <img {src} alt="Middleground" class="absolute inset-0 z-20 h-full w-full object-contain" />
            {/each}
            {#each layers.foreground as src}
                <img {src} alt="Foreground" class="absolute inset-0 z-30 h-full w-full object-contain" />
            {/each}
        </div>
        <video
            bind:this={video1}
            autoplay
            muted
            playsinline
            class="absolute inset-0 z-50 h-full w-full object-contain mix-blend-screen"
            on:ended={handleVideoEnd}
        >
            <source src="/dynabackground/inksplash/ink3.webm" type="video/webm" />
        </video>
    </section>
    <img src="/dynabackground/inksplash/Events_Char.webp" alt="Overlay" class="centered-img" />

</div>

<!-- OUTSIDE EFFECTS -->

<style lang="postcss">
    .relative {
        width: 100%;
        height: 100%;
    }
    .centered-img {
    position: absolute;
    top: 50%;
    left: 45%; /* Small offset to the left */
    transform: translate(-50%, -50%);
    height: 50vh;
    object-fit: contain;
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}
</style>