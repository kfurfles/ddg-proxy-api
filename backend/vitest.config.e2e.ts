import swc from 'unplugin-swc';
import path from 'path';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
	test: {
		testTimeout: 90000,
		coverage: {
			provider: 'v8',
			exclude: [
				...coverageConfigDefaults.exclude,
				'**/typings/**/*.*',
				'**/*.controller.ts',
				'**/*.module.ts',
				'src/lib/**/*.*',
				'src/main.ts',
				'src/config/**/*.*',
			],
		},
		include: ['**/*.e2e-spec.ts'],
		exclude: ['**/typings/**/*.*'],
		globals: true,
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
	plugins: [swc.vite(), swc.rollup()],
});
