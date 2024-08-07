import { ReactNode } from "react";
import { ReactQueryProvider } from "./react-query.provider";
import { ThemeProvider } from "./theme.provider";

interface Props {
    children: ReactNode
}
export function AppProvider({ children } : Props) {
    return (
        <div>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <ReactQueryProvider>
                    {children}
                </ReactQueryProvider>
            </ThemeProvider>
        </div>
    )
}