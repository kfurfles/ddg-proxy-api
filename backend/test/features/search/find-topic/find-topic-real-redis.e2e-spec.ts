import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { vi } from 'vitest';
import path from 'path';
import fs from 'fs';
import request from 'supertest';
import { env } from '@/config/env';
import axios from 'axios';
import { SearchModule } from '@/modules/search/search.module';
import { HISTORY_FILE_TOKEN } from '@/modules/search/contants';
import { FactoryModule } from '@/modules/cache';
const TEST_HISTORY_FILE_PATH = path.join(
	env.ROOT_PATH,
	'test',
	`${path.basename(__filename)}_temp_history.txt`,
);

describe('Search Module Feature Find Topic Using Real Redis (e2e)', () => {
	let app: INestApplication;
	let container: StartedRedisContainer;

	beforeAll(async () => {
		container = await new RedisContainer().withPassword('test').start();
	});

	beforeEach(async () => {
		if (fs.existsSync(TEST_HISTORY_FILE_PATH)) {
			fs.rmSync(TEST_HISTORY_FILE_PATH, { force: true });
		}

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				SearchModule,
				FactoryModule({
					CACHE_TYPE: 'redis',
					REDIS_HOST: container.getHost(),
					REDIS_PASSWORD: container.getPassword(),
					REDIS_PORT: container.getPort(),
				}),
			],
		})
			.overrideProvider(HISTORY_FILE_TOKEN)
			.useValue(TEST_HISTORY_FILE_PATH)
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('Retrieve API DDG search Using API Using Real Redis', async () => {
		const getSpy = vi.spyOn(axios, 'get');

		await request(app.getHttpServer())
			.get('/api/search?text=futsal')
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty('id');
				expect(response.body).toHaveProperty('title');
				expect(response.body).toHaveProperty('topics');
				expect(Array.isArray(response.body.topics)).toBeTruthy();
			});

		expect(getSpy).toHaveBeenCalled();
	});

	it('Retrieve API DDG search Using Redis', async () => {
		const getSpy = vi.spyOn(axios, 'get');

		await request(app.getHttpServer())
			.get('/api/search?text=mustang')
			.expect(200);

		await request(app.getHttpServer())
			.get('/api/search?text=mustang')
			.expect(200);

		expect(getSpy).toHaveBeenCalledTimes(1);
	});

	afterAll(async () => {
		await app.close();
		if (fs.existsSync(TEST_HISTORY_FILE_PATH)) {
			fs.rmSync(TEST_HISTORY_FILE_PATH, { force: true });
		}
		setTimeout(() => {
			container.stop();
		}, 3000);
	});
});
