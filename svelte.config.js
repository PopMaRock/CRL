import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    vitePreprocess({
      style: {
        css: {
          postcss: join(__dirname, "postcss.config.cjs"),
        },
      },
    }),
  ],
  // Disable A11y warnings - don't have time for it's high horse bullshit.
  //TODO: Consider enabling this in the future. - if can be arsed, update workspace settings as well.
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return;
    }
    handler(warning);
  },
  compilerOptions: {
    customElement: true,
  },
  kit: {
    adapter: adapter(),
    alias: {
      $components: "./src/components",
      $stores: "./src/lib/stores",
      $utilities: "./src/lib/utils",
    },
    // https://kit.svelte.dev/docs/configuration#alias
  },
};

export default config;
