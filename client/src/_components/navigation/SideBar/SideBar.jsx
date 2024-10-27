import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";
import SideOptions from "./SideOptions.jsx";
import { MdLibraryMusic } from "react-icons/md";
import Toggle from "./Toggle";
const SideBar = () => {
  const { collapse, onCollapse, onExpand } = useSidebar((state) => state);
  const matches = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (matches) onCollapse();
    else onExpand();
  }, [matches, onCollapse, onExpand]);

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col rounded-tr-lg w-56  border-t border-b bg-[#0e0e10] h-full mt-[70px] ml-2 border-r border-[#0e0e10] transition-width duration-500",
        collapse && "w-[4.7rem] transition-width duration-200"
      )}
    >
      <div
        className={`flex items-center  ${
          collapse ? "justify-center" : "justify-between"
        }  py-4 px-2 bg-[#252525] rounded-t`}
      >
        <div className="flex items-center justify-center">
          <MdLibraryMusic size={30} onClick={onExpand} cursor={"pointer"} />
          {!collapse && (
            <h1 className="text-md nunito-sans-bold ml-3">Your Library</h1>
          )}
        </div>

        <div>{!collapse && <Toggle />}</div>
      </div>

      <SideOptions />
    </aside>
  );
};

export default SideBar;
