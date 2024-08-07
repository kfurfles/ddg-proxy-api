import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SideBarContent } from "./sidebar-content";
import { ReactNode } from "react";

interface Props {
  children: ReactNode
}

export function SheetMenu({ children }: Props) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
            <h1 className="font-bold text-lg">Histórico</h1>
        </SheetHeader>
        <SideBarContent isOpen >{children}</SideBarContent>
      </SheetContent>
    </Sheet>
  );
}