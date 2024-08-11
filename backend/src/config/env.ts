// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@dotenvx/dotenvx').config();
import z from 'zod';
import root from 'app-root-path';

interface Environment {
	ROOT_PATH: string;
	CACHE_TYPE: 'redis' | 'local';
	REDIS_HOST: string;
	REDIS_PORT: number;
	REDIS_PASSWORD: string;
	PORT: number;
}

const envSchema = z.object({
	ROOT_PATH: z.string().min(1),
	CACHE_TYPE: z.string().min(1),
	REDIS_HOST: z.string().min(1),
	REDIS_PORT: z.number(),
	REDIS_PASSWORD: z.string().min(1),
	PORT: z.number(),
});

export const env = envSchema.parse({
	ROOT_PATH: root.path,
	CACHE_TYPE: process.env?.CACHE_TYPE === 'redis' ? 'redis' : 'local',
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: Number(process.env.REDIS_PORT),
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	PORT: Number(process.env.PORT ?? 3000),
}) as Environment;
