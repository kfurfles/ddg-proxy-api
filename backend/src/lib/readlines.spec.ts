import { env } from '@/config/env';
import path from 'path';
import { readLines } from './readlines';
import { readLinesSed } from './readlines-sed';
import { performance } from 'perf_hooks';

describe('readlines', () => {
	const largeFilePath = path.join(env.ROOT_PATH, 'fixtures', 'large-file.txt');
	it('should lines [1, 3, 4, 5] using streams ', async () => {
		const start = performance.now();
		const { lines, total } = await readLines(largeFilePath, [1, 3, 4, 5]);
		const end = performance.now();
		console.log(`Execution time: ${end - start} milliseconds`);
		expect(Array.isArray(lines)).toBe(true);

		expect(total).toBe(9999);
	});

	it('should lines [1, 3, 4, 5] using system function', async () => {
		const start = performance.now();
		const lines = await readLinesSed(largeFilePath, [1, 3, 4, 5]);
		const end = performance.now();
		console.log(`Execution time: ${end - start} milliseconds`);
		expect(Array.isArray(lines)).toBe(true);
	});
});
