import { ReactNode } from "react";
import { ModeToggle } from "../ui/mode-toogle";
import { SheetMenu } from "./sheet-menu";
interface Props {
  children: ReactNode
  headerContent: ReactNode
}

export function Navbar({ children, headerContent }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu>
            {children}
          </SheetMenu>
        </div>
        {headerContent}
        <div className="flex flex-1 items-center space-x-2 justify-end ml-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}