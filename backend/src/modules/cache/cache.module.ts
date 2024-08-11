import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { env } from '@/config/env';
export async function FactoryModule(
	environemnt: Pick<
		typeof env,
		'CACHE_TYPE' | 'REDIS_HOST' | 'REDIS_PASSWORD' | 'REDIS_PORT'
	>,
) {
	const { CACHE_TYPE, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = environemnt;
	return NestCacheModule.registerAsync({
		isGlobal: true,
		useFactory: async () => {
			if (CACHE_TYPE === 'local')
				return {
					store: 'memory',
					max: 9000,
				} as any;

			return {
				store: await redisStore({
					ttl: 60000, // 60000 = 1 second
					socket: {
						host: REDIS_HOST,
						port: REDIS_PORT,
					},
					password: REDIS_PASSWORD,
				}),
			};
		},
	});
}

export const CacheModule = FactoryModule(env);
