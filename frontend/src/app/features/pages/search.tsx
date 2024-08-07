import { Search } from 'lucide-react'


export function SearchPage() {
    return (
        <div>
            <div 
                style={{ width: 'min(800px, 90%)' }} 
                className="glass rounded-sm mx-auto py-2 px-4 w-full flex gap-2 items-center justify-center"
                >
                <input className="flex h-10 w-full outline-none bg-transparent px-3 py-2 text-sm" 
                />
                <Search className="w-8 h-w-8 text-zinc-500 dark:text-zinc-50" />
            </div>
        </div>
    )
}