import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const AlbumSkeleton = ({count}) => {

    return (<div className="flex flex-wrap items-center mr-[160px]">
        {[...Array(count)].map((_, i) => (
            <div key={i} className={"flex items-center m-4 "}>
                <div className={"flex flex-col"}>
                    <div>
                        <Skeleton height={190} width={200}/>
                    </div>
                    <div>
                        <Skeleton height={20} width={120}/>
                    </div>
                    <div>
                        <Skeleton height={20} width={90}/>
                    </div>

                </div>
            </div>))}
    </div>);
};

export default AlbumSkeleton;
