import { Controller, Get, Query } from '@nestjs/common';
import { FindTopicUseCase } from '../useCases/findTopic.usecase';
import { HistoryTopicsUseCase } from '../useCases/historyTopics.usecase';

@Controller('api/search')
export class SearchController {
	constructor(
		private readonly findTopicUseCase: FindTopicUseCase,
		private readonly historyTopicsUseCase: HistoryTopicsUseCase,
	) {}

	@Get()
	search(@Query('text') text: string) {
		return this.findTopicUseCase.execute({ text });
	}

	@Get('/history')
	getHistory(@Query('offset') offset?: string) {
		return this.historyTopicsUseCase.execute({ offset });
	}
}
