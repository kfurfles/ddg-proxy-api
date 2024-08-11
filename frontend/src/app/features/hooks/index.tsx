/* eslint-disable @typescript-eslint/no-explicit-any */
import { LastSearchesApiService, SearchApiService } from "@/api";
import { SearchApi } from "@/types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSearch(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['SEARCH'],
        mutationFn: async (params: SearchApi['request']): Promise<SearchApi["response"]> => {
            return SearchApiService(params)
        },
        onSuccess(){
            queryClient.invalidateQueries({
                queryKey: ['SEARCH', "LAST_SEARCHS"],
                stale: true
            })
        }
    })
}

export function useLastSearchs() {
    return useInfiniteQuery({
        queryKey: ['SEARCH', "LAST_SEARCHS"],
        queryFn: ({ pageParam }: { pageParam: number}) => LastSearchesApiService({ offset: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage: { meta: { next: any; offset: any; }; }) =>
          lastPage.meta.next ? lastPage.meta.offset : undefined,
    });
}