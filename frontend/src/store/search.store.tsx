import { create } from 'zustand'

interface SearchState {
  lastSearch?: { title: string, id: string }
  find?: string
  mapOcc: Map<string, number>
  setOccurrences: (occ: Map<string, number>) => void;
  AddOccurrences: (content: string, occ: number) => void;
  setFind:( word?: string) => void
  setLastSearch: (search: { title: string, id: string }) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
    lastSearch: undefined,
    find: undefined,
    mapOcc: new Map,
    setOccurrences:( mapOcc: Map<string, number>) => set((state) => {
      return {
        ...state,
        mapOcc
      }
    }),
    AddOccurrences:(content: string, occ: number) => set((state) => {
      const newOcc = new Map(state.mapOcc)
      newOcc.set(content, occ)
      return {
        ...state,
        mapOcc: newOcc
      }
    }),
    setFind: (word?: string) => set((state) => ({ ...state, find: word })),
    setLastSearch: (search: { title: string, id: string }) => set((state) => ({ ...state, lastSearch: search })),
}))