/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockSearch } from "@/api";
import { SearchApi } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useSearch(params: SearchApi['request']){
    return useQuery({
        queryKey: ['SEARCH', params.text],
        queryFn: async (): Promise<any> => {
            return mockSearch(params)
        },
        enabled: params?.text.length > 0
    })
}