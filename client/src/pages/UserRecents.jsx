import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import useHover from "@/hooks/useHover.js";
import usePlayerStore from "@/store/use-player.js";
import Wrapper from "@/pages/Wrapper.jsx";
import { decodeHtmlEntities, truncateString } from "@/utils/MusicUtils.js";
import { FaPlay } from "react-icons/fa";
import AlbumSkeleton from "@/_components/skeletons/AlbumSkeleton.jsx";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { LazyLoadImage } from "react-lazy-load-image-component";

const UserRecents = () => {
  const { hoveredItemId, handleMouseEnter, handleMouseLeave } = useHover();
  const { playSong } = usePlayerStore();
  const {
    data: songHistory,
    error,
    isLoading
  } = useSWR("user-recents", () => tuneMateInstance.getUserSongHistory());

  if (error)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  return (
    <Wrapper>
      <BlockWrapper margin={"mb-20 md:mb-8"}>
        <div className="mb-8 ml-1">
          <div className={"flex items-center justify-between p-4"}>
            <h1 className="text-2xl md:text-3xl jaro-head">Recently Played</h1>
          </div>
          {isLoading ? (
            <AlbumSkeleton count={20} />
          ) : (
            <div className="flex flex-col">
              <div className="flex md:flex-wrap flex-col md:flex-row ">
                {songHistory.length > 0 &&
                  songHistory?.map((song) => (
                    <div
                      key={song.id}
                      className="flex cursor-pointer md:flex-col  justify-end  hover:bg-[#303033]  p-3 md:rounded-xl md:w-52 md:h-64 md:justify-center"
                      onMouseEnter={() => handleMouseEnter(song.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="relative md:h-44 md:w-44 flex-0">
                        <LazyLoadImage
                          effect="blur"
                          wrapperProps={{
                            style: { transitionDelay: "0.5s" }
                          }}
                          loading="lazy"
                          src={song.image}
                          alt=""
                          className="rounded-xl h-12 w-12  md:h-44 md:w-44"
                        />

                        {hoveredItemId === song.id && (
                          <div className="hidden md:block">
                            <div
                              className="absolute bottom-0 right-1 mb-2 mr-2 h-12 w-12  rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out transform opacity-100 scale-100 hover:scale-110 hover:shadow-lg"
                              onClick={() => playSong(song.id)}
                              style={{
                                opacity: hoveredItemId === song.id ? 1 : 0
                              }}
                            >
                              <FaPlay
                                size={15}
                                color={"black"}
                                className={"relative left-[1px] top-[1px]"}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex  items-center justify-between flex-1 ">
                        <div className="flex flex-col mt-1 ml-4 md:ml-0">
                          <h2 className="mt-1 nunito-sans-bold">
                            {truncateString(decodeHtmlEntities(song.name), 15)}
                          </h2>
                          <div className="flex items-center text-xs">
                            <p className="text-[11px] text-[#6a6a6a] nunito-sans-bold">
                              {truncateString(
                                decodeHtmlEntities(song.album),
                                25
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="md:hidden">
                          {hoveredItemId === song.id && (
                            <div
                              className=" mb-2 mr-2 h-8 w-8 md:h-12 md:w-12 rounded-full bg-[#59c2ef] flex  items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out transform opacity-100 scale-100 hover:scale-110 hover:shadow-lg"
                              onClick={() => playSong(song.id)}
                              style={{
                                opacity: hoveredItemId === song.id ? 1 : 0
                              }}
                            >
                              <FaPlay
                                size={12}
                                color={"black"}
                                className={"relative left-[1px] top-[1px]"}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </BlockWrapper>
    </Wrapper>
  );
};

export default UserRecents;
