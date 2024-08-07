import { SideBarContent } from "./sidebar-content";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app.store";
import { SidebarToggle } from "./sidebar-toogle";
import { History as HistoryIcon } from 'lucide-react'
import { ReactNode } from "react";

interface Props{
  children: ReactNode
}

export function Sidebar({ children }: Props) {
  const { isOpen, setIsOpen } = useAppStore()
  
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="glass gap-4 relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <div className="flex items-center gap-4 pl-3">
          <HistoryIcon />
          { isOpen && <h1 className="font-bold text-lg">Histórico</h1> }

        </div>
        <SideBarContent 
          isOpen={isOpen}
          children={children} 
        />
      </div>
    </aside>
  );
}