import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";


// eslint-disable-next-line react/prop-types
const ToolTip = ({ label, children, side }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent
                    className="text-black bg-white rounded-[3px]"
                    side={side}
                >
                    <p className="font-semibold text-[10px] tracking-wider">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ToolTip;