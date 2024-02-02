import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$styles: path.resolve('./src/styles'),
			$static: path.resolve('./static'),
			$models: path.resolve('./src/lib/models'),
			$assets: path.resolve('./src/assets')
		}
	}
});
