import { SearchApi, Topic } from "@/types";
import { DDG_SEARCH_RESPONSE } from "@/types/requestResponse";

export function mockSearch({ text }: SearchApi['request']): Promise<Topic[]> {
    return fetch(`https://api.duckduckgo.com/?q=${text}&format=json`)
        .then(r => r.json())
        .then((data: typeof DDG_SEARCH_RESPONSE) => {
            const { RelatedTopics } = data
            
            const topics: Topic[] = RelatedTopics.map(relateTopic => {
                if("Topics" in relateTopic){
                    return {
                        type: 'AGGREGATED',
                        subTopicName: relateTopic.Name,
                        topics: (relateTopic?.Topics || []).map(subTopic => {
                            const URL = subTopic?.Icon?.URL ?? ''
                            return {
                                type: 'TOPIC',
                                url: subTopic.FirstURL,
                                html: subTopic.Result,
                                text: subTopic.Text,
                                img: URL.length > 0 ? `https://duckduckgo.com${URL}` : undefined
                            }  as Topic
                        })
                    } as Topic
                }

                const URL = relateTopic?.Icon?.URL ?? ''

                return {
                    type: 'TOPIC',
                    url: relateTopic.FirstURL,
                    html: relateTopic.Result,
                    img: URL.length > 0 ? `https://duckduckgo.com${URL}` : undefined
                }  as Topic
                
            })

            return topics
        })
}
