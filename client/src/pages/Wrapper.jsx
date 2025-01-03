// eslint-disable-next-line react/prop-types
import { useSidebar } from "@/store/use-sidebar.js";
import { useMediaQuery } from "usehooks-ts";

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => {
  const { collapse } = useSidebar((state) => state);
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div
      className={`flex flex-col  ${
        !isMobile && (collapse ? "ml-24" : "ml-60")
      }  rounded-lg`}
    >
      <div className={"mt-16 mb-10"}>{children}</div>
    </div>
  );
};

export default Wrapper;
