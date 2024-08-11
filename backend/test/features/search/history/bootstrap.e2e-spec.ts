import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { env } from '@/config/env';
import { HISTORY_FILE_TOKEN } from '@/modules/search/contants';
import { SearchModule } from '@/modules/search/search.module';
import { FactoryModule } from '@/modules/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEYS } from '@/modules/cache/constants';
import { enrichemntBlobFixture } from '@root/fixtures/enrichemnt-cache';
const TEST_HISTORY_FILE_PATH = path.join(
	env.ROOT_PATH,
	'test',
	`${path.basename(__filename)}_temp_history.txt`,
);

describe('Search Module Feature Bootstrap (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		if (fs.existsSync(TEST_HISTORY_FILE_PATH)) {
			fs.rmSync(TEST_HISTORY_FILE_PATH, { force: true });
		}
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				SearchModule,
				FactoryModule({
					CACHE_TYPE: 'local',
					REDIS_HOST: '',
					REDIS_PASSWORD: '',
					REDIS_PORT: 0,
				}),
			],
		})
			.overrideProvider(HISTORY_FILE_TOKEN)
			.useValue(TEST_HISTORY_FILE_PATH)
			.compile();

		app = moduleFixture.createNestApplication();
	});

	it('Should create a history file', async () => {
		expect(fs.existsSync(TEST_HISTORY_FILE_PATH)).toBeFalsy();
		await app.init();
		expect(fs.existsSync(TEST_HISTORY_FILE_PATH)).toBeTruthy();
	});

	it('Should enrich cache with files', async () => {
		const enrichmentData = await enrichemntBlobFixture(TEST_HISTORY_FILE_PATH);
		await app.init();
		const cacheService: Cache = app.get(CACHE_MANAGER);

		for await (const row of enrichmentData) {
			const data = await cacheService.get(
				CACHE_KEYS.topic(String(row.title).toLowerCase()),
			);
			expect(data).toBeTruthy();
		}
		const keys = enrichmentData.map((_, idx) =>
			CACHE_KEYS.topicListItem(idx + 1),
		);

		const itemList = await cacheService.store.mget(...keys);
		const total = await cacheService.get(CACHE_KEYS.totalTopics());

		expect(total === enrichmentData.length).toBeTruthy();
		expect(itemList.length === enrichmentData.length).toBeTruthy();
	});

	afterAll(() => {
		if (fs.existsSync(TEST_HISTORY_FILE_PATH)) {
			fs.rmSync(TEST_HISTORY_FILE_PATH, { force: true });
		}
	});
});
