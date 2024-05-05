import Toggle from "./Toggle";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const SideBar = ({ children }) => {

    const { collapse, onCollapse, onExpand } = useSidebar((state) => state);
    const matches = useMediaQuery("(max-width: 1024px)");

    useEffect(() => {
        if (matches) onCollapse();
        else onExpand();
    }, [matches, onCollapse, onExpand]);

    return (
        <aside className={cn(
            "fixed left-0 flex flex-col rounded-tr-lg w-60 h-full border-t bg-[#18181b] border-r border-[#2D2E35] z-50 mt-[68px]  transition-width duration-500 p-2",
            collapse && "w-[4.5rem] transition-width duration-500 "
        )}  >
            <Toggle />
            <h1> {children}</h1>
        </aside >
    )
}

export default SideBar