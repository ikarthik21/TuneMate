import Toggle from "./Toggle";
import {useSidebar} from "@/store/use-sidebar";
import {cn} from "@/lib/utils";
import {useMediaQuery} from "usehooks-ts";
import {useEffect} from "react";
import SideOptions from "./SideOptions.jsx"

const SideBar = () => {

    const {collapse, onCollapse, onExpand} = useSidebar((state) => state);
    const matches = useMediaQuery("(max-width: 1024px)");

    useEffect(() => {
        if (matches) onCollapse(); else onExpand();
    }, [matches, onCollapse, onExpand]);

    return (<aside
        className={cn("fixed left-0 flex flex-col rounded-tr-lg w-60 h-full border-t  border-b  bg-[#18181b] border-r border-[#2D2E35]   mt-[70px]  transition-width duration-500 p-2", collapse && "w-[4.5rem] transition-width duration-500 ")}>

        <div className={"flex flex-col"}>
            <Toggle/>
            <SideOptions/>
        </div>

    </aside>)
}

export default SideBar