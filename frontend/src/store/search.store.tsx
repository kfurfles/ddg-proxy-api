import { create } from 'zustand'

interface SearchState {
  lastSearch: string
  setLastSearch: (search: string) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
    lastSearch: '',
    setLastSearch: (search: string) => set((state) => ({ ...state, lastSearch: search })),
}))