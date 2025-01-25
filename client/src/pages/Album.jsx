import Wrapper from "@/pages/Wrapper.jsx";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import { useParams } from "react-router-dom";
import {
  decodeHtmlEntities,
  formatTime,
  truncateString
} from "@/utils/MusicUtils.js";
import usePlayerStore from "@/store/use-player.js";
import { FaPlay } from "react-icons/fa";
import UserPlayListSkeleton from "@/_components/skeletons/UserPlayListSkeleton.jsx";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { useMediaQuery } from "usehooks-ts";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Album = () => {
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { playSong, playlist, loadPlaylist, playSongByIndex } =
    usePlayerStore();
  const {
    data: album,
    error,
    isLoading
  } = useSWR(id ? ["album", id] : null, () =>
    MusicServiceInstance.getAlbumById(id)
  );

  const handlePlayWholeList = async () => {
    await loadPlaylist({ id: album?.id, type: "ALBUM", index: 0 });
  };

  const allArtists = (artists) => {
    let str = "";
    artists.map((artist) => (str += artist.name));
    return str;
  };

  if (error)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  const renderAlbumDetails = () => (
    <div className="flex flex-col">
      <div className="flex md:items-end md:flex-row flex-col pt-12 p-4">
        <div className="flex items-center justify-center">
          {album.image ? (
            <LazyLoadImage
              effect="blur"
              wrapperProps={{
                style: { transitionDelay: "0.5s" }
              }}
              loading="lazy"
              src={album?.image[1].url}
              alt="Image"
              className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
            />
          ) : (
            <BiSolidPlaylist size={100} color={"#59c2ef"} />
          )}
        </div>

        <div className="md:ml-8 mt-4 flex items-start flex-col ">
          <h1 className="text-3xl md:text-7xl ubuntu-bold ">
            {truncateString(decodeHtmlEntities(album?.name), 15)}
          </h1>
          <p className="text-sm md:text-lg">
            {album?.songCount ? album?.songCount : 0} Songs
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
      {album?.songs.map((song, index) => (
        <div
          key={song.id}
          className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
          onClick={() =>
            playlist.songs.length > 0 && playlist.id === album.id
              ? playSongByIndex(index)
              : playSong(song.id)
          }
        >
          <div className="flex items-center">
            <div className="mr-2">
              <h3>{index + 1}</h3>
            </div>
            <div className="flex flex-col flex-1 ml-2">
              <h1 className="nunito-sans-bold">
                {truncateString(
                  decodeHtmlEntities(song.name),
                  isMobile ? 30 : undefined
                )}
              </h1>
              <div className="flex items-center">
                <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">
                  {truncateString(
                    allArtists(album.artists.primary),
                    isMobile ? 30 : undefined
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
            {renderAlbumDetails()}
            {renderSongsList()}
          </>
        )}
      </BlockWrapper>
    </Wrapper>
  );
};

export default Album;
