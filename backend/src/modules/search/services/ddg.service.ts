import { getDDGTopics } from '@/lib/ddg';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Topic } from '../typings';

@Injectable()
export class DDGService {
	async getTopics(text: string) {
		try {
			const { data } = await getDDGTopics(text);

			const { RelatedTopics } = data;

			const topics: Topic[] = RelatedTopics.map((relateTopic) => {
				if ('Topics' in relateTopic) {
					return {
						type: 'AGGREGATED',
						subTopicName: relateTopic.Name,
						topics: (relateTopic?.Topics || []).map((subTopic) => {
							const URL = subTopic?.Icon?.URL ?? '';
							return {
								type: 'TOPIC',
								url: subTopic.FirstURL,
								html: subTopic.Result,
								text: subTopic.Text,
								img:
									URL.length > 0 ? `https://duckduckgo.com${URL}` : undefined,
							} as Topic;
						}),
					} as Topic;
				}

				const URL = relateTopic?.Icon?.URL ?? '';

				return {
					type: 'TOPIC',
					url: relateTopic.FirstURL,
					html: relateTopic.Result,
					text: relateTopic?.Text,
					img: URL.length > 0 ? `https://duckduckgo.com${URL}` : undefined,
				} as Topic;
			});

			return topics;
		} catch (error) {
			throw new InternalServerErrorException('DDG API not available');
		}
	}
}
