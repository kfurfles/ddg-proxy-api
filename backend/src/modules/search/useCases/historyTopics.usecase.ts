import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HISTORY_FILE_TOKEN } from '../contants';
import { FileTextService } from '@/modules/external-storage/services/file-text.service';
import { UseCase } from '@/core/typings';
import { ResponseTopic } from '../typings';
import { CACHE_KEYS } from '@/modules/cache/constants';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

interface Request {
	offset?: string;
}

export interface ResponseUsecase {
	topics: Pick<ResponseTopic, 'id' | 'title'>[];
	meta: {
		offset: number;
		next: boolean;
	};
}

@Injectable()
export class HistoryTopicsUseCase implements UseCase<Request, ResponseUsecase> {
	constructor(
		@Inject(HISTORY_FILE_TOKEN) private readonly historyFilePath: string,
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly fileTextService: FileTextService,
	) {}

	async execute(params: Request): Promise<ResponseUsecase> {
		const PER_PAGE = 20;
		const { offset = '0' } = params;
		let offsetNumber = Number(offset);

		if (Number.isNaN(offsetNumber) || !/^\d+$/.test(offset)) {
			throw new BadRequestException('the param {offset} should be a number');
		}
		offsetNumber = Math.floor(offsetNumber);

		if (offsetNumber < 0) {
			throw new BadRequestException(
				'the param {offset} should greather than zero',
			);
		}

		const cacheRangeKeys = Array.from({ length: PER_PAGE + 1 }, (_, idx) =>
			CACHE_KEYS.topicListItem(idx + offsetNumber + 1),
		);

		const topics = (await this.cache.store.mget(
			...cacheRangeKeys,
		)) as ResponseTopic[];
		const lastTopic = topics.pop();

		const hasAllElements = topics.every((topic) => !!topic);

		if (hasAllElements) {
			return {
				topics: topics,
				meta: {
					offset: offsetNumber === 0 ? PER_PAGE : offsetNumber,
					next: !!lastTopic,
				},
			};
		}

		return this.loadFromFile(offsetNumber, PER_PAGE);
	}

	async loadFromFile(
		offset: number,
		perPage: number,
	): Promise<ResponseUsecase> {
		const initialOffset = offset + 1;
		const finalOffset = offset + perPage + 1;
		const { lines, total } = await this.fileTextService.getRangeLines(
			this.historyFilePath,
			initialOffset,
			finalOffset,
		);

		const updatedMappedCacheKeys: [string, unknown][] = lines.map(
			(data, idx) => {
				const key = CACHE_KEYS.topicListItem(idx + offset + 1);
				return [key, JSON.parse(data)];
			},
		);

		await this.cache.store.mset(updatedMappedCacheKeys);

		return {
			topics: lines.map((line) => {
				const { id, title } = JSON.parse(line) as ResponseTopic;

				return {
					id,
					title,
				};
			}),
			meta: {
				next: total > finalOffset,
				offset: offset === 0 ? perPage : offset,
			},
		};
	}
}
