/* eslint-disable react/prop-types */
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMediaQuery } from "usehooks-ts";

const MobileAlbumSkeleton = ({ count }) => {
  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={"flex items-center mr-4 overflow-hidden mt-4 mb-4"}
        >
          <div className={"flex flex-col"}>
            <div>
              <Skeleton height={120} width={125} className="rounded" />
            </div>
            <div>
              <Skeleton height={20} width={80} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AlbumSkeleton = ({ count }) => {
  return (
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
  );
};

const HomeSkeleton = ({ count }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="mt-2">
      {!isMobile ? (
        <div>
          <div>
            <Skeleton height={200} />
          </div>
          <AlbumSkeleton count={count} />
        </div>
      ) : (
        <div>
          <div className="">
            <Skeleton className={"w-full h-44"} />
          </div>
          <MobileAlbumSkeleton count={2} />
        </div>
      )}
    </div>
  );
};

export { HomeSkeleton, MobileAlbumSkeleton };
