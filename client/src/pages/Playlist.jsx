import { useParams } from "react-router-dom";
import usePlayerStore from "@/store/use-player.js";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import {
  decodeHtmlEntities,
  formatTime,
  truncateString
} from "@/utils/MusicUtils.js";
import Wrapper from "@/pages/Wrapper.jsx";
import { FaPlay } from "react-icons/fa";
import UserPlayListSkeleton from "@/_components/skeletons/UserPlayListSkeleton.jsx";
import { useMediaQuery } from "usehooks-ts";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Playlist = () => {
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { playSong, loadPlaylist, playlist, playSongByIndex } =
    usePlayerStore();

  const {
    data: PlayList,
    error,
    isLoading
  } = useSWR(id ? ["playlist", id] : null, () =>
    MusicServiceInstance.getPlaylistById(id)
  );

  const handlePlayWholeList = async () => {
    await loadPlaylist({ id, type: "PLAYLIST", index: 0 });
  };

  if (isLoading) return <></>;
  if (error)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  const renderPlaylistDetails = () => (
    <div className="flex flex-col">
      <div className="flex md:items-end md:flex-row flex-col pt-12 p-4">
        <div className="flex items-center justify-center">
          {PlayList.image ? (
            <LazyLoadImage
              effect="blur"
              wrapperProps={{
                style: { transitionDelay: "0.5s" }
              }}
              loading="lazy"
              src={PlayList?.image[1].url}
              alt={PlayList?.name}
              className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
            />
          ) : (
            <BiSolidPlaylist size={100} color={"#59c2ef"} />
          )}
        </div>

        <div className="mt-8 md:ml-8">
          <h1 className="text-3xl md:text-7xl ubuntu-bold">
            {truncateString(PlayList?.name, 20)}
          </h1>

          <p className="text-sm md:text-lg">
            {truncateString(PlayList?.description, 35)}
          </p>

          <p className="text-sm">
            {PlayList.songs ? PlayList.songs.length : 0} Songs
          </p>
        </div>
      </div>

      <div className={"items-center flex "}>
        <div
          className={
            "p-4 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"
          }
          onClick={handlePlayWholeList}
        >
          <FaPlay size={14} color={"black"} className={"relative left-[2px]"} />
        </div>
      </div>
    </div>
  );

  const renderSongsList = () => (
    <div className="flex flex-col mt-4">
      {PlayList?.songs.map((song, index) => (
        <div
          key={song.id}
          className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
          onClick={() =>
            playlist.songs.length > 0 && playlist.id === PlayList.id
              ? playSongByIndex(index)
              : playSong(song.id)
          }
        >
          <div className="flex items-center">
            <div className="mr-2">
              <h3>{index + 1}</h3>
            </div>
            <div className="flex items-center flex-1 ml-2">
              <LazyLoadImage
                effect="blur"
                wrapperProps={{
                  style: { transitionDelay: "0.5s" }
                }}
                loading="lazy"
                src={song.image[1].url}
                alt={song.name}
                className="h-9 w-9 rounded"
              />

              <div className="flex flex-col ml-4">
                <h1 className="nunito-sans-bold">
                  {truncateString(
                    decodeHtmlEntities(song?.name),
                    isMobile ? 22 : undefined
                  )}
                </h1>
                <p className="text-xs text-[#6a6a6a]">
                  {" "}
                  {truncateString(
                    decodeHtmlEntities(song?.album.name),
                    isMobile ? 22 : undefined
                  )}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <p>{formatTime(song.duration)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Wrapper>
      <BlockWrapper margin={"mb-20 md:mb-8"}>
        {isLoading ? (
          <UserPlayListSkeleton count={10} />
        ) : (
          <>
            {renderPlaylistDetails()}
            {renderSongsList()}
          </>
        )}
      </BlockWrapper>
    </Wrapper>
  );
};

export default Playlist;
