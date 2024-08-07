import { ReactNode } from "react";
import { ModeToggle } from "../ui/mode-toogle";
import { SheetMenu } from "./sheet-menu";
interface Props {
  children: ReactNode
}

export function Navbar({ children }: Props) {
  return (
    <header className="sticky top-0 z-10 w-full">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu>{children}</SheetMenu>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}