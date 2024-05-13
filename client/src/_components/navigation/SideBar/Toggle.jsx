import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";
import {useSidebar} from "@/store/use-sidebar";
import ToolTip from "@/components/ToolTip";

const Toggle = () => {

    const {collapse, onExpand, onCollapse} = useSidebar((state) => state);
    const currentState = collapse ? "expand" : "collapse";

    return (<div
        className={"cursor-pointer flex " + (collapse ? "justify-center" : " justify-end")}
    >
        {collapse ? (<ToolTip label={currentState} side="right">
            <ArrowRightFromLine onClick={onExpand} color="white"/>
        </ToolTip>) : (<ToolTip label={currentState} side="left">
            <ArrowLeftFromLine onClick={onCollapse} color="white"/>
        </ToolTip>)}
    </div>);
};

export default Toggle;