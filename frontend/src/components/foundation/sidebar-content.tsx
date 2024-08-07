import { ReactNode } from "react"

interface Props {
    isOpen: boolean
    children: ReactNode
}
export function SideBarContent({ isOpen, children }: Props) {
    if(!isOpen) return null
    return (<div>{children}</div>)
}