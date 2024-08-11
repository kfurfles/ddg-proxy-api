import swc from 'unplugin-swc';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		root: './',
		coverage: {
			provider: 'v8',
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/typings/**/*.*',
				'**/*.controller.ts',
				'**/*.module.ts',
				'src/main.ts',
				'src/config/**/*.*',
			],
		},
		alias: {
			'@root': path.resolve(__dirname, './'),
			'@': path.resolve(__dirname, './src'),
			'@test': path.resolve(__dirname, './test'),
		},
	},
	resolve: {
		alias: {
			'@root': path.resolve(__dirname, './'),
			'@': path.resolve(__dirname, './src'),
			'@test': path.resolve(__dirname, './test'),
		},
	},
	plugins: [
		// This is required to build the test files with SWC
		swc.vite({
			// Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
			module: { type: 'es6' },
		}),
	],
});
