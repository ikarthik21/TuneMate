import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const UserPlayListSkeleton = ({ count }) => {
  return (
    <div className={"pt-4 ml-4"}>
      <div className={"flex flex-col"}>
        <div className={"flex flex-col items-center md:items-end md:flex-row"}>
          <div>
            <Skeleton height={180} width={180} />
          </div>
        </div>

        <div className={"mt-8"}>
          <Skeleton circle={true} height={50} width={50} />
        </div>

        <div className={"flex flex-col mt-12"}>
          {[...Array(count)].map((_, i) => (
            <div key={i} className={"m-1"}>
              <div className={"flex items-end "}>
                <div>
                  <Skeleton height={50} width={50} />
                </div>
                <div className={"ml-4 w-[calc(100%-100px)]"}>
                  <Skeleton height={50} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPlayListSkeleton;
