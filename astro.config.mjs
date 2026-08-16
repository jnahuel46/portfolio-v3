import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://jeremiasmuriette.dev',
	fonts: [
		{
			// Chunky arcade display face. Only ever used at small sizes.
			provider: fontProviders.google(),
			name: 'Press Start 2P',
			cssVariable: '--font-press-start',
			weights: [400],
			subsets: ['latin'],
		},
		{
			// Pixel face that stays readable in long paragraphs.
			provider: fontProviders.google(),
			name: 'VT323',
			cssVariable: '--font-vt323',
			weights: [400],
			subsets: ['latin'],
		},
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
