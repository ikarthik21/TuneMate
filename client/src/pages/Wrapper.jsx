// eslint-disable-next-line react/prop-types
import {useSidebar} from "@/store/use-sidebar.js";

// eslint-disable-next-line react/prop-types
const Wrapper = ({children}) => {
    const {collapse} = useSidebar((state) => state);
    return (<div className={`flex flex-col  ${collapse ? "ml-24" : "ml-60"} mr-3 rounded-lg`}>
        <div className={"mt-16 mb-16"}>
            {children}
        </div>
    </div>);
};

export default Wrapper;
