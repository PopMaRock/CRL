<script lang="ts">
  import { goto } from "$app/navigation";
  import { authHandlers } from "$stores/authStore";
  //import { getFormData } from '$utilities/utilities';
  import { ProgressBar, getToastStore } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  const toastStore = getToastStore();
  let loading = false;

  async function tryLogin(e: Event) {
    const form: HTMLFormElement = e.target as HTMLFormElement;
    //const formData: any = getFormData(form);
    /*if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }*/
    try {
      loading = true;
      //await authHandlers.login(formData.email, formData.password);
      goto("/CRL", { invalidateAll: true });
    } catch (error: any) {
      console.error(error);
      //toastStore.trigger(systemError(error.code));
    } finally {
      loading = false;
    }
  }
  // Create an array of image paths
  const images = Array.from(
    { length: 27 },
    (_, i) => `welcome${i === 0 ? "" : i}.png`
  );
  let randomImage = "";
  // Select a random image
  onMount(() => {
    randomImage = images[Math.floor(Math.random() * images.length)];
  });
</script>

<div class="h-screen">
  <div class="flex min-h-screen">
    <div
      class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 class="mt-6 text-3xl font-bold tracking-tight flex items-center">
            <img src="/crl-images/icon_logo.png" class="align-center w-12" alt="Welcome to CRL" />
            &nbsp; ?
          </h2>
        </div>
        {#if loading}
          <div>
            <ProgressBar class="items-start justify-start mx-15" />
          </div>
        {/if}
        <div class="mt-8">
          <div class="mt-6">
            <form
              on:submit|preventDefault={tryLogin}
              method="POST"
              class="space-y-6"
            >
              <div>
                <label for="email" class="block text-sm font-medium">Name</label
                >
                <div class="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autocomplete="name"
                    disabled={loading}
                    required={false}
                    class="input w-full px-3 py-2"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium"
                  >Password</label
                >
                <div class="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    disabled={loading}
                    required={false}
                    class="input w-full px-3 py-2"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label for="remember-me" class="ml-2 block text-sm"
                    >Remember me</label
                  >
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  class="btn w-full px-8 py-3 variant-filled-primary relative"
                  >BY PASS --&gt;</button
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {#if randomImage}
    <div class="relative hidden w-0 flex-1 lg:block" transition:fade>
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="/crl-images/welcome/{randomImage}"
        alt=""
      />
    </div>
    {/if}
  </div>
</div>
