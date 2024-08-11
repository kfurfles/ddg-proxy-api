import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HISTORY_FILE_TOKEN } from '../contants';
import { FileTextService } from '@/modules/external-storage/services/file-text.service';
import fs from 'fs';
import { ResponseTopic } from '../typings';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_KEYS } from '@/modules/cache/constants';

@Injectable()
export class BootstrapFeatureUseCase implements OnApplicationBootstrap {
	constructor(
		@Inject(HISTORY_FILE_TOKEN) private readonly historyFilePath: string,
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly fileTextService: FileTextService,
	) {}
	async onApplicationBootstrap() {
		await this.fileTextService.createFile(this.historyFilePath);
		await this.enrichmentCache();
	}

	async enrichmentCache() {
		let totalLines = 0;
		const enrichTopic = (data: ResponseTopic, idx: number) => {
			return Promise.all([
				this.cache.set(CACHE_KEYS.topic(data.title), data),
				this.cache.set(CACHE_KEYS.topicListItem(idx), data),
			]);
		};
		const topicList: { idx: number; data: ResponseTopic }[] = [];
		for await (const line of this.readFromBlobStorage(this.historyFilePath)) {
			totalLines += 1;
			const data = JSON.parse(line) as ResponseTopic;
			topicList.push({ idx: totalLines, data });
		}

		await Promise.all(topicList.map(({ data, idx }) => enrichTopic(data, idx)));
		await this.cache.set(CACHE_KEYS.totalTopics(), totalLines);
	}

	async *readFromBlobStorage(filePath: string) {
		const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
		let buffer = '';
		let position = 0;

		for await (const chunk of stream) {
			buffer += chunk;
			let lineBreak = buffer.indexOf('\n', position);

			while (lineBreak > -1) {
				yield buffer.slice(position, lineBreak);
				position = lineBreak + 1;
				lineBreak = buffer.indexOf('\n', position);
			}

			buffer = buffer.slice(position);
			position = 0;
		}

		if (buffer.length > 0) {
			yield buffer;
		}
	}
}
