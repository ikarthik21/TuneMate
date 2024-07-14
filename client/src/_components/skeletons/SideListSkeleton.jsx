import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const SideListSkeleton = ({count}) => {

    return (<div className="flex flex-col">
        {[...Array(count)].map((_, i) => (

            <div key={i} className={"flex items-center cursor-pointer  mb-2  rounded overflow-hidden "}>
                <div className={"flex-[0.2] flex items-center justify-center ml-2"}>
                    <Skeleton height={52} width={52}/>
                </div>
                <div className={"flex-[0.8]   ml-2 mr-2"}>
                    <div>
                        <Skeleton height={25}/>
                    </div>
                    <div>
                        <Skeleton height={25}/>
                    </div>
                </div>
            </div>))}
    </div>);
};

export default SideListSkeleton;
