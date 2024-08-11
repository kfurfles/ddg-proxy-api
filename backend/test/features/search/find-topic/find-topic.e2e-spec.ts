import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi } from 'vitest';
import path from 'path';
import fs from 'fs';
import request from 'supertest';
import { env } from '@/config/env';
import axios from 'axios';
import { SearchModule } from '@/modules/search/search.module';
import { HISTORY_FILE_TOKEN } from '@/modules/search/contants';
import { FactoryModule } from '@/modules/cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
const TEST_HISTORY_FILE_PATH = path.join(
	env.ROOT_PATH,
	'test',
	`${path.basename(__filename)}_temp_history.txt`,
);

describe('Search Module Feature Find Topic (e2e)', () => {
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
		await app.init();
		const cache: Cache = app.get(CACHE_MANAGER);
		cache.del('*');
	});

	it('Retrieve API DDG search Using API', async () => {
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

	it('Retrieve API DDG search Using cache', async () => {
		const getSpy = vi.spyOn(axios, 'get');

		await request(app.getHttpServer())
			.get('/api/search?text=mustang')
			.expect(200);

		await request(app.getHttpServer())
			.get('/api/search?text=mustang')
			.expect(200);

		expect(getSpy).toHaveBeenCalledTimes(1);
	});

	it('Return friendly message if DDG API Down', async () => {
		const getSpy = vi
			.spyOn(axios, 'get')
			.mockRejectedValue(new Error('API Down'));

		await request(app.getHttpServer())
			.get('/api/search?text=houses')
			.expect(500, {
				error: 'Internal Server Error',
				message: 'DDG API not available',
				statusCode: 500,
			});

		getSpy.mockRestore();
	});

	// it.skip('Generate Fixture', async () => {
	// 	const sleep = () =>
	// 		new Promise((res) => {
	// 			setTimeout(() => {
	// 				res(200);
	// 			}, 300);
	// 		});
	// 	const words = [
	// 		'Mariposa',
	// 		'Prisma',
	// 		'Orvalho',
	// 		'Neblina',
	// 		'Silêncio',
	// 		'Labirinto',
	// 		'Miragem',
	// 		'Eclipse',
	// 		'Catedral',
	// 		'Oásis',
	// 		'Horizonte',
	// 		'Enigma',
	// 		'Fulgor',
	// 		'Nostalgia',
	// 		'Bruma',
	// 		'Épico',
	// 		'Fantasia',
	// 		'Solstício',
	// 		'Utopia',
	// 		'Renovação',
	// 		'Vórtice',
	// 		'Saga',
	// 		'Constelação',
	// 		'Metamorfose',
	// 		'Aurora',
	// 		'Paradoxo',
	// 		'Fábula',
	// 		'Galáxia',
	// 		'Reflexo',
	// 		'Infinito',
	// 		'Abacaxi',
	// 		'Aventura',
	// 		'Balão',
	// 		'Carro',
	// 		'Dama',
	// 		'Elefante',
	// 		'Foguete',
	// 		'Gato',
	// 		'Horizonte',
	// 		'Ilha',
	// 		'Jogo',
	// 		'Kiwi',
	// 		'Lápis',
	// 		'Mágica',
	// 		'Navio',
	// 		'Ovelha',
	// 		'Pássaro',
	// 		'Quadro',
	// 		'Rato',
	// 		'Sapo',
	// 		'Tartaruga',
	// 		'Urso',
	// 		'Vaca',
	// 		'Xaxim',
	// 		'Zebra',
	// 		'Árvore',
	// 		'Bolha',
	// 		'Casa',
	// 		'Dente',
	// 		'Escola',
	// 		'Fada',
	// 		'Gelo',
	// 		'História',
	// 		'Imagem',
	// 		'Janela',
	// 		'Ketchup',
	// 		'Livro',
	// 		'Morte',
	// 		'Noite',
	// 		'Ovo',
	// 		'Pente',
	// 		'Quente',
	// 		'Rua',
	// 		'Sol',
	// 		'Tinta',
	// 		'Uva',
	// 		'Vento',
	// 		'Xadrez',
	// 		'Yoga',
	// 		'Zangão',
	// 		'Açúcar',
	// 		'Baleia',
	// 		'Caneta',
	// 		'Doce',
	// 		'Escova',
	// 		'Feijão',
	// 		'Garrafa',
	// 		'Helicóptero',
	// 		'Inseto',
	// 		'Jujuba',
	// 	];

	// 	const data = [];
	// 	for await (const word of words) {
	// 		await sleep();

	// 		await request(app.getHttpServer())
	// 			.get(`/api/search?text=${word}`)
	// 			.then(async (response) => {
	// 				data.push(response.body);

	// 				return true;
	// 			});

	// 		console.log({ word });
	// 	}
	// 	const fixturesFolderPath = path.join(env.ROOT_PATH, 'fixtures');

	// 	const filePath = path.join(fixturesFolderPath, `cache-enrichment.json`);

	// 	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

	// 	return true;
	// });

	afterAll(async () => {
		if (fs.existsSync(TEST_HISTORY_FILE_PATH)) {
			fs.rmSync(TEST_HISTORY_FILE_PATH, { force: true });
		}
	});
});
