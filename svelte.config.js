import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [vitePreprocess({
		style: {
			css: {
				postcss: join(__dirname, 'postcss.config.cjs')
			}
		}
	})],
	compilerOptions: {
		customElement: true
	},
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components',
			$stores: './src/lib/stores',
			$utilities: './src/lib/utils',
		}
		// https://kit.svelte.dev/docs/configuration#alias
	},
	 // Disable accessibility warnings - don't have time for A11y's bullshit.
	 onwarn: (warning, handler) => {
		if (warning.code.includes("a11y")) return;
		handler(warning);
	  },
}

export default config
