export type SingleTopic = {
    url: string
    img?: string
    text: string
    html: string
    type: 'TOPIC'
}

export type AggregatedTopics = {
    type: 'AGGREGATED'
    subTopicName?: string;
    topics: SingleTopic[]
}

export type Topic = SingleTopic | AggregatedTopics

export interface SearchApi {
    request: {
        text: string
    }
    response: {
        id: string
        duration: number
        topics: Topic[]
        title: string
    }
}

export interface LastSearchesApi {
    request: {
        offset: number
    }
    response: {
        topics: { title: string, id: string }[]
        meta: {
            offset: number,
            next: boolean
        }
    }
}