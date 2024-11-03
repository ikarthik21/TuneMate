import Wrapper from "./Wrapper";
import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import { Link } from "react-router-dom";
import usePlayerStore from "@/store/use-player.js";
import AlbumSkeleton from "@/_components/skeletons/AlbumSkeleton.jsx";
import useAuthStore from "@/store/use-auth.js";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import MusicSlider from "@/_components/navigation/Slider/Slider";
import { decodeHtmlEntities, truncateString } from "@/utils/MusicUtils.js";
import { FaPlay } from "react-icons/fa";
import useHover from "@/hooks/useHover.js";

const Home = () => {
  const { playSong } = usePlayerStore();
  const { hoveredItemId, handleMouseEnter, handleMouseLeave } = useHover();
  const { isAuthenticated } = useAuthStore();
  const {
    data: recommended,
    error,
    isLoading
  } = useSWR("tunemate-recommend", () =>
    tuneMateInstance.getTuneMateRecommended()
  );

  const {
    data: songHistory,
    err,
    isLoading: RecentsLoading
  } = useSWR(isAuthenticated ? "user-song-history" : null, () =>
    tuneMateInstance.getUserSongHistory()
  );

  if (error || err)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  return (
    <Wrapper>
      <BlockWrapper>
        {/* Song of the Week */}

        {recommended?.tuneMateUpdates?.length > 0 && (
          <div className="rounded-xl rounded-b-none mb-2 p-2 pt-4 pb-4 song-of-week-background">
            <div className="flex items-center ml-4 p-2">
              <div>
                <img
                  src={recommended?.tuneMateUpdates[0].Content.image}
                  alt=""
                  className="h-48 w-48 rounded-lg"
                />
              </div>
              <div className="ml-4 flex flex-col">
                <h1 className="ubuntu-bold text-3xl ">
                  {recommended?.tuneMateUpdates[0].title}
                </h1>
                <h2 className="mt-4 text-xl nunito-sans-bold">
                  {recommended?.tuneMateUpdates[0].Content.name}
                </h2>
                <h3 className="nunito-sans-bold text-sm">
                  {recommended?.tuneMateUpdates[0]?.Content?.album}
                </h3>
                <button
                  className="p-2 custom-btn rounded-lg mt-4 px-12 py-2"
                  onClick={() =>
                    playSong(recommended?.tuneMateUpdates[0].Content.songId)
                  }
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-2">
          <h1 className={"text-2xl ubuntu-bold"}>Tunemate Recommended</h1>
          <div className="flex flex-col">
            {isLoading ? (
              <AlbumSkeleton count={8} />
            ) : (
              <MusicSlider musicList={recommended?.playlists} />
            )}
          </div>
        </div>

        {isAuthenticated && (
          <>
            {RecentsLoading ? (
              <AlbumSkeleton count={4} />
            ) : (
              <>
                {songHistory?.length > 0 && (
                  <div className="mb-8 p-2">
                    <div className={"flex items-center justify-between"}>
                      <h1 className="text-2xl ubuntu-bold">Recently Played</h1>
                      <Link to={"/recent"}>
                        <h1
                          className={
                            "hover:underline nunito-sans-bold text-sm underline underline-offset-2"
                          }
                        >
                          Show all
                        </h1>
                      </Link>
                    </div>

                    <div className="flex flex-col h-[280px]">
                      <div className="flex flex-wrap overflow-y-hidden ">
                        {songHistory?.map((song) => (
                          <div
                            key={song.id}
                            className="flex cursor-pointer flex-col m-2 hover:bg-[#303033] p-3 rounded-xl w-52 h-64 justify-center"
                            onMouseEnter={() => handleMouseEnter(song.id)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="relative h-44 w-44">
                              <img
                                src={song.image}
                                alt=""
                                className="rounded-xl h-44 w-44"
                              />
                              {hoveredItemId === song.id && (
                                <div
                                  className="absolute bottom-0 right-1 mb-2 mr-2 h-12 w-12 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out transform opacity-100 scale-100 hover:scale-110 hover:shadow-lg"
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
                              )}
                            </div>

                            <div className="flex flex-col mt-1">
                              <h3 className="mt-1 nunito-sans-bold">
                                {truncateString(
                                  decodeHtmlEntities(song.name),
                                  15
                                )}
                              </h3>
                              <div className="flex items-center text-xs">
                                <p className="text-[11px] text-[#6a6a6a] nunito-sans-bold">
                                  {truncateString(
                                    decodeHtmlEntities(song.album),
                                    25
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </BlockWrapper>
    </Wrapper>
  );
};

export default Home;
