import { differenceInDays, startOfDay } from "date-fns";
import { groupBy } from 'lodash'
import { Loader2 } from "lucide-react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { LastSearchesApi } from "@/types";
import { useLastSearchs } from "../../hooks";
import { useSearchStore } from "@/store/search.store";
type TopicWithDay = LastSearchesApi["response"]["topics"][0] & { offsetDay: number }

function PreviousSearch({ title, onClick }: { id: string; title: string, onClick: () => void }) {

  return (
    <div onClick={onClick} className="p-2 font-semibold cursor-pointer hover:bg-slate-500 rounded-sm">
      <div className="truncate w-[240px]">
        {title}
      </div>
    </div>
  );
}

function DaySectionGroup({ diffDays, topics }: { diffDays: string, topics: TopicWithDay[] }) {
  const title = MapLabels[diffDays as keyof typeof MapLabels ] ?? `${diffDays} day ago`
  const { setLastSearch } = useSearchStore()
  return (
    <div>
      <div className="capitalize text-zinc-400 text-sm">{title}</div>
      <div className="grid gap-1 mt-2 pl-1">
        {topics.map(topic => <PreviousSearch onClick={() => setLastSearch({ id: topic.id, title: topic.title })} key={topic.id} {...topic} />)}
      </div>
    </div>
  )
}

const today = startOfDay(new Date())
const MapLabels = ({
  "0": "today",
  "1": "yesterday",
});

export function SearchHistory() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useLastSearchs();

  const pages = data?.pages ?? [];

  const topics = pages.reduce((acc, cur) => {
    const list = (cur?.topics ?? []).map(topic => {
        return {
            offsetDay: differenceInDays(today, startOfDay(new Date(Number(topic.id)))),
            ...topic
        }
    });
    return [...acc, ...list];
  }, [] as TopicWithDay[]);
  
  const sortedTopics = topics.sort((a,b) => a.id > b.id ? -1 : 1)

  const groupedByDays = groupBy(sortedTopics, topic => String(topic.offsetDay))

  const isInitialLoading = data === undefined && isLoading 

  return (
    <div className="grid gap-3">
			{Object.entries(groupedByDays).map(([key, topics]) => {
        return (
          <DaySectionGroup 
            key={`${key}-${topics.length}`} 
            diffDays={key}
            topics={topics}
          />)
			})}
      <InfiniteScroll
        hasMore={hasNextPage}
        isLoading={isLoading}
        next={fetchNextPage}
        threshold={0.5}
      >
        {hasNextPage && (
          <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin" />
        )}
      </InfiniteScroll>
      { isInitialLoading && <Loader2 className="mx-auto my-4 h-8 w-8 animate-spin" /> }
    </div>
  );
}
