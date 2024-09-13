import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from "react-loading-skeleton";

const UserPlayListSkeleton = ({count}) => {
    return (<div className={"mt-20"}>
        <div className={"flex flex-col"}>
            <div className={"flex items-end"}>
                <div>
                    <Skeleton height={180} width={180}/>
                </div>
                <div className={"ml-4 "}>
                    <div>
                        <Skeleton height={50} width={600}/>
                        <Skeleton height={35} width={200}/>
                    </div>
                </div>
            </div>

            <div className={"mt-8"}>
                <Skeleton circle={true} height={50} width={50}/>
            </div>

            <div className={"flex flex-col mt-12 ml-24"}>
                {[...Array(count)].map((_, i) => (<div key={i} className={"m-1"}>
                        <div className={"flex items-end "}>
                            <div className={"mr-2"}>
                                <Skeleton height={60} width={60}/>
                            </div>
                            <div className={"ml-4"}>
                                <Skeleton height={60} width={1000}/>
                            </div>
                        </div>
                    </div>


                ))}
            </div>
        </div>
    </div>);
};

export default UserPlayListSkeleton;