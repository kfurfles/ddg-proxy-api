type SingleTopic = {
    url: string
    img?: string
    text: string
    html: string
    type: 'TOPIC'
}

type AggregatedTopics = {
    type: 'AGGREGATED'
    subTopicName?: string;
    topics: Omit<Topic, 'topics' | 'subTopicName'>[]
}

export type Topic = SingleTopic | AggregatedTopics

export interface SearchApi {
    request: {
        text: string
    }
    response: {
        topics: Topic[]
        lastSearchs: []
    }
}