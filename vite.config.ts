import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, './src/index.ts'),
			name: 'Validation',
			fileName: 'index',
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
	plugins: [
		vue(),
		vueDevTools(),
		dts({
			tsconfigPath: './tsconfig.app.json',
		}),
	],
});
