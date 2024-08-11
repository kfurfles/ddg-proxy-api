import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { env } from '@/config/env';
import request from 'supertest';
import { HISTORY_FILE_TOKEN } from '@/modules/search/contants';
import { SearchModule } from '@/modules/search/search.module';
import { FactoryModule } from '@/modules/cache';
import { enrichemntBlobFixture } from '@root/fixtures/enrichemnt-cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_KEYS } from '@/modules/cache/constants';
const TEST_HISTORY_FILE_PATH = path.join(
	env.ROOT_PATH,
	'test',
	`${path.basename(__filename)}_temp_history.txt`,
);

describe('Search Module Feature Pagination with Cache (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
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
		enrichemntBlobFixture(TEST_HISTORY_FILE_PATH);
		await app.init();
	});

	it('Should List pagination', async () => {
		await request(app.getHttpServer())
			.get('/api/search/history')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				for (const topic of response.body.topics) {
					expect(topic).toHaveProperty('title');
					expect(topic).toHaveProperty('id');
				}
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 20);
				expect(response.body.meta).toHaveProperty('next', true);
			});

		await request(app.getHttpServer())
			.get('/api/search/history?offset=20')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				for (const topic of response.body.topics) {
					expect(topic).toHaveProperty('title');
					expect(topic).toHaveProperty('id');
				}
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 20);
				expect(response.body.meta).toHaveProperty('next', true);
			});

		await request(app.getHttpServer())
			.get('/api/search/history?offset=40')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				for (const topic of response.body.topics) {
					expect(topic).toHaveProperty('title');
					expect(topic).toHaveProperty('id');
				}
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 40);
				expect(response.body.meta).toHaveProperty('next', true);
			});

		await request(app.getHttpServer())
			.get('/api/search/history?offset=80')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				for (const topic of response.body.topics) {
					expect(topic).toHaveProperty('title');
					expect(topic).toHaveProperty('id');
				}
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 80);
				expect(response.body.meta).toHaveProperty('next', false);
			});

		await request(app.getHttpServer())
			.get('/api/search/history?offset=100')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				expect(Array.isArray(response.body.topics)).toBeTruthy();
				expect(response.body.topics.length).toBe(0);
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 100);
				expect(response.body.meta).toHaveProperty('next', false);
			});
	});

	it('Should List pagination after TTL expire data and enrich Cache', async () => {
		await request(app.getHttpServer())
			.get('/api/search/history')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				for (const topic of response.body.topics) {
					expect(topic).toHaveProperty('title');
					expect(topic).toHaveProperty('id');
				}
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 20);
				expect(response.body.meta).toHaveProperty('next', true);
			});

		const cacheRangeKeys = Array.from({ length: 5 }, (_, idx) =>
			CACHE_KEYS.topicListItem(idx + 1),
		);

		const cache = app.get<Cache>(CACHE_MANAGER);
		await cache.store.mdel(...cacheRangeKeys);

		await request(app.getHttpServer())
			.get('/api/search/history')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('topics');
				for (const topic of response.body.topics) {
					expect(topic).toHaveProperty('title');
					expect(topic).toHaveProperty('id');
				}
				expect(response.body).toHaveProperty('meta');
				expect(response.body.meta).toHaveProperty('offset', 20);
				expect(response.body.meta).toHaveProperty('next', true);
			});

		const topics = await cache.store.mget(...cacheRangeKeys);

		expect(topics.every((topic) => !!topic)).toBeTruthy();
	});

	it('Should test validation api params', async () => {
		await request(app.getHttpServer())
			.get('/api/search/history?offset=random_teste')
			.expect(400);

		await request(app.getHttpServer())
			.get('/api/search/history?offset=0.000000001')
			.expect(400);

		await request(app.getHttpServer())
			.get('/api/search/history?offset=-200')
			.expect(400);
	});

	afterAll(async () => {
		await app.close();
		if (fs.existsSync(TEST_HISTORY_FILE_PATH)) {
			fs.rmSync(TEST_HISTORY_FILE_PATH, { force: true });
		}
	});
});
