export const CACHE_KEYS = {
	topic: (key: string) => `TOPIC:${key.toLowerCase()}`,
	topicListItem: (idx: number) => `TOPIC:IDX:${idx}`,
	totalTopics: () => 'TOTAL_TOPICS',
};
