import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../core/typings';
import { ResponseTopic } from '../typings';
import { DDGService } from '../services/ddg.service';
import { AddHistoryService } from '../services/add-history.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEYS } from '@/modules/cache/constants';
import { differenceInMilliseconds } from 'date-fns';

interface Params {
	text: string;
}

@Injectable()
export class FindTopicUseCase implements UseCase<Params, ResponseTopic> {
	constructor(
		private readonly ddgService: DDGService,
		private readonly addHistoryService: AddHistoryService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}
	async execute({ text }: Params) {
		const now = new Date();
		const cachedResponse = await this.cacheService.get<ResponseTopic | null>(
			CACHE_KEYS.topic(text),
		);

		if (cachedResponse) {
			return {
				...cachedResponse,
				duration: differenceInMilliseconds(new Date(), now),
				id: String(now.getTime()),
			};
		}
		const topics = await this.ddgService.getTopics(text);

		const { id, title } = await this.addHistoryService.add({
			requestAt: now,
			response: topics,
			title: text,
		});

		await this.cacheService.set(CACHE_KEYS.topic(text), { id, title, topics });

		const total = await this.cacheService.get<number>(CACHE_KEYS.totalTopics());

		await this.cacheService.set(CACHE_KEYS.topicListItem(total + 1), {
			id,
			title,
			topics,
		});

		return {
			id,
			title,
			topics,
			duration: differenceInMilliseconds(new Date(), now),
		};
	}
}
