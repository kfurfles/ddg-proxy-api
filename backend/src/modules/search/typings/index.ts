export type SingleTopic = {
	url: string;
	img?: string;
	text: string;
	html: string;
	type: 'TOPIC';
};

export type AggregatedTopics = {
	type: 'AGGREGATED';
	subTopicName?: string;
	topics: SingleTopic[];
};

export interface ResponseTopic {
	id: string;
	title: string;
	duration: number;
	topics: Topic[];
}

export type Topic = SingleTopic | AggregatedTopics;

export type LastTopic = { title: string; id: string };
