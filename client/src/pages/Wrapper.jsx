// eslint-disable-next-line react/prop-types
import {useSidebar} from "@/store/use-sidebar.js";

// eslint-disable-next-line react/prop-types
const Wrapper = ({children}) => {
    const {collapse} = useSidebar((state) => state);
    return (<div className={`flex flex-col  ${collapse ? "ml-24 " : "ml-80"} mr-12`}>
        <div className={"mt-20 mb-20"}>
            {children}
        </div>
    </div>);
};

export default Wrapper;
