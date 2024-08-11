import { ReactNode } from "react";
import { Sidebar } from "@/components/foundation/sidebar";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app.store";
import { Navbar } from "@/components/foundation/navbar";

interface Props {
  children: ReactNode;
  sidebarContent: ReactNode
  headerContent: ReactNode
}

export function AppContainer({ 
  children, 
  sidebarContent, 
  headerContent 
}: Props) {
  const { isOpen } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar>{sidebarContent}</Sidebar>
      <main
        className={cn(
          "min-h-[calc(100vh)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <div>
            <Navbar headerContent={headerContent}>{sidebarContent}</Navbar>
            <div className="container pt-8 pb-8 px-4 sm:px-8 z-10 relative">{children}</div>
        </div>
      </main>
    </div>
  );
}
