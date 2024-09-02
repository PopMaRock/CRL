import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import Icons from 'unplugin-icons/vite'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	define: {
		'process.env': process.env
	},
	build: {
		sourcemap: true
	},
	plugins: [
		sveltekit(),
		purgeCss(),
		Icons({
			compiler: 'svelte',
			autoInstall: true	// experimental - autoinstalls icons as and when used.
		}),
	]
});

