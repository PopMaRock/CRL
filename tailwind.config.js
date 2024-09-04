/** @type {import('tailwindcss').Config} */
import { join } from 'node:path'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
	},
	plugins: [
		typography,
		forms,
		skeleton({
			themes: {
				preset: [
					{ name: 'crimson', enhancements: true },
				]
			}
		})
	]
};
