/* eslint-disable react/prop-types */
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeSkeleton = ({ count }) => {
  return (
    <div className="flex flex-wrap items-center">
      <div className="flex flex-col mt-2">
        <div>
          <Skeleton height={200} />
        </div>

        <div className="flex flex-wrap items-center mt-2 ">
          {[...Array(count)].map((_, i) => (
            <div key={i} className={"flex items-center mr-4  mb-4"}>
              <div className={"flex flex-col"}>
                <div>
                  <Skeleton height={180} width={190} />
                </div>
                <div>
                  <Skeleton height={20} width={120} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
