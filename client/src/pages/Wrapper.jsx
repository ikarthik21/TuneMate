// eslint-disable-next-line react/prop-types
import {useSidebar} from "@/store/use-sidebar.js";
import ConnectorDialog from "@/_components/UserSync/ConnectorDialog.jsx";

// eslint-disable-next-line react/prop-types
const Wrapper = ({children}) => {
    const {collapse} = useSidebar((state) => state);
    return (<div className={`flex flex-col  ${collapse ? "ml-36 " : "ml-80"} mr-28`}>
        <div className={"mt-20 mb-20"}>
            <ConnectorDialog/>
            {children}
        </div>
    </div>);
};

export default Wrapper;
