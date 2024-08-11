import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { DDGService } from './services/ddg.service';
import { FindTopicUseCase } from './useCases/findTopic.usecase';
import { AddHistoryService } from './services/add-history.service';
import { BootstrapFeatureUseCase } from './useCases/bootstrapTopics.usecase';
import { env } from '@/config/env';
import path from 'path';
import { HISTORY_FILE_TOKEN } from './contants';
import { ExternalStorageModule } from '../external-storage/external-storage.module';
import { HistoryTopicsUseCase } from './useCases/historyTopics.usecase';

const HISTORY_FILE_PATH = path.join(env.ROOT_PATH, 'blob', 'history.txt');

@Module({
	imports: [ExternalStorageModule],
	providers: [
		{
			provide: HISTORY_FILE_TOKEN,
			useValue: HISTORY_FILE_PATH,
		},
		AddHistoryService,
		DDGService,
		BootstrapFeatureUseCase,
		FindTopicUseCase,
		HistoryTopicsUseCase,
	],
	controllers: [SearchController],
})
export class SearchModule {}
