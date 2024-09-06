import { sveltekit } from '@sveltejs/kit/vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import Icons from 'unplugin-icons/vite'
import dotenv from 'dotenv';
import type { UserConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

dotenv.config();

const config: UserConfig = {
	define: {
		'process.env': process.env,
		__version__: JSON.stringify(process.env.npm_package_version),

	},
	build: {
		sourcemap: true
	},
	plugins: [
		[
			sveltekit(),
			purgeCss(),
			wasm(),
			topLevelAwait(),
		],
		Icons({
			compiler: 'svelte',
			autoInstall: true	// experimental - autoinstalls icons as and when used.
		}),
	],
};
export default config;

