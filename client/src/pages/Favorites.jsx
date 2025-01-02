import useSWR, { mutate } from "swr";
import tuneMateInstance from "@/service/api/api.js";
import usePlayerStore from "@/store/use-player.js";
import Wrapper from "@/pages/Wrapper.jsx";
import useHover from "@/hooks/useHover.js";
import FavImage from "@/assets/images/favorites.png";
import useAuthStore from "@/store/use-auth.js";
import {
  decodeHtmlEntities,
  formatTime,
  truncateString
} from "@/utils/MusicUtils.js";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaPause, FaPlay } from "react-icons/fa";
import Toast from "@/utils/Toasts/Toast.js";
import useClick from "@/hooks/useClick.js";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";

const Favorites = () => {
  const { playSong, loadPlaylist, playlist, playSongByIndex } =
    usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const { getFavorites, songId, isPlaying, handleAudioPlay } = usePlayerStore();
  const {
    data: favorites,
    error,
    isLoading
  } = useSWR(isAuthenticated ? "favorites" : null, () =>
    tuneMateInstance.getFavorites()
  );

  const { hoveredItemId, handleMouseEnter, handleMouseLeave } = useHover();
  const { clickedItemId, setClickedItemId } = useClick();

  const removeSongFromFavorites = async (e, songId) => {
    try {
      e.stopPropagation();
      const response = await tuneMateInstance.ManageSongInFavorites(songId);
      Toast({ type: response.type, message: response.message, duration: 400 });
      mutate("favorites");
      await getFavorites();
    } catch (error) {
      console.error("Error removing song from favorites:", error);
    }
  };

  const handlePlayWholeList = async () => {
    await loadPlaylist({ id: "FAVORITES", type: "FAVORITES", index: 0 });
  };

  if (isLoading)
    return (
      <div>
        <h1>Loading.....</h1>
      </div>
    );
  if (error)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  const renderAlbumDetails = () => (
    <div className="flex items-center">
      <div className="flex md:flex-row flex-col  md:items-end pt-20 p-4 ">
        <div>
          <img src={FavImage} alt="Favorites" className="h-28 w-28" />
        </div>

        <div className="md:ml-8 mt-4 md:mt-0 flex  flex-col">
          <h1 className="text-3xl md:text-7xl ubuntu-bold">Favorites</h1>
          <p className="text-sm md:text-lg">
            {favorites ? favorites.length : 0} Songs
          </p>
        </div>
      </div>
    </div>
  );

  const renderSongsList = () => (
    <div className={"flex flex-col md:pb-0 pb-8"}>
      <div className={"items-center flex "}>
        <div
          className={
            "p-4 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"
          }
          onClick={handlePlayWholeList}
        >
          <FaPlay
            size={14}
            color={"black"}
            className={"relative  left-[2px]"}
          />
        </div>
      </div>

      {isAuthenticated && (
        <div className="flex flex-col mt-4  mb-5">
          {favorites?.length > 0 ? (
            favorites.map((song, index) => (
              <div
                key={song.id}
                className={`flex flex-col m-1 p-3 rounded-xl ${
                  clickedItemId === song.id
                    ? "bg-[#1B1B1B]"
                    : "hover:bg-[#2e2e34] "
                }`}
                onMouseEnter={() => handleMouseEnter(song.id)}
                onMouseLeave={handleMouseLeave}
                onDoubleClick={() =>
                  playlist.songs.length > 0 && playlist.id === "FAVORITES"
                    ? playSongByIndex(index)
                    : playSong(song.id)
                }
                onClick={() => {
                  setClickedItemId(song.id);
                }}
              >
                <div className="flex items-center ">
                  <div className="mr-2 flex items-center justify-center w-4">
                    {hoveredItemId === song.id || clickedItemId === song.id ? (
                      songId === song.id ? (
                        isPlaying ? (
                          <FaPause
                            size={16}
                            color={`${
                              songId === song.id ? "#59c2ef" : "white"
                            }`}
                            onClick={handleAudioPlay}
                          />
                        ) : (
                          <FaPlay
                            size={13}
                            color={`${
                              songId === song.id ? "#59c2ef" : "white"
                            }`}
                            className="relative left-[2px]"
                            onClick={handleAudioPlay}
                          />
                        )
                      ) : (
                        <FaPlay
                          size={13}
                          color="white"
                          className="relative left-[2px]"
                          onClick={() =>
                            playlist.songs.length > 0 &&
                            playlist.id === "FAVORITES"
                              ? playSongByIndex(index)
                              : playSong(song.id)
                          }
                        />
                      )
                    ) : (
                      <h3
                        className={`${
                          songId === song.id ? "text-[#59c2ef]" : ""
                        }`}
                      >
                        {" "}
                        {index + 1}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center flex-1 ml-2">
                    <img
                      src={song.imageUrl}
                      alt={song.name}
                      className="h-9 w-9 rounded"
                    />
                    <div className="flex flex-col ml-4">
                      <h1
                        className={`nunito-sans-bold ${
                          songId === song.id ? "text-[#59c2ef]" : ""
                        }`}
                      >
                        {truncateString(decodeHtmlEntities(song.name))}
                      </h1>
                      <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">
                        {truncateString(
                          decodeHtmlEntities(song.primaryArtists)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div>
                      {hoveredItemId === song.id && (
                        <IoMdRemoveCircle
                          color="#59c2ef"
                          size={20}
                          onClick={(e) => removeSongFromFavorites(e, song.id)}
                        />
                      )}
                    </div>
                    <p
                      className={`${
                        songId === song.id ? "text-[#59c2ef]" : "text-white"
                      } ml-4`}
                    >
                      {formatTime(song.duration)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center min-h-48 justify-center">
              <h1>No Favorite Songs added</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Wrapper>
      <BlockWrapper>
        {renderAlbumDetails()}
        {renderSongsList()}
      </BlockWrapper>
    </Wrapper>
  );
};

export default Favorites;
