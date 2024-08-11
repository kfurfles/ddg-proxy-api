import { Module } from '@nestjs/common';
import { SearchModule } from './modules/search/search.module';
import { CacheModule } from '@/modules/cache';

@Module({
	imports: [CacheModule, SearchModule],
	providers: [],
})
export class AppModule {}
