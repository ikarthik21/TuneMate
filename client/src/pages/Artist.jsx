import Wrapper from "@/pages/Wrapper.jsx";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import {
  decodeHtmlEntities,
  formatTime,
  truncateString,
  getAllArtists
} from "@/utils/MusicUtils.js";
import { MdVerified } from "react-icons/md";
import usePlayerStore from "@/store/use-player.js";
import { FaPlay } from "react-icons/fa";
import UserPlayListSkeleton from "@/_components/skeletons/UserPlayListSkeleton.jsx";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { useMediaQuery } from "usehooks-ts";

const Artist = () => {
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { playSong, loadPlaylist, playlist, playSongByIndex } =
    usePlayerStore();

  const {
    data: artist,
    error,
    isLoading
  } = useSWR(id ? ["artist", id] : null, () =>
    MusicServiceInstance.getArtistById(id)
  );

  const handlePlayWholeList = async () => {
    await loadPlaylist({ id, type: "ARTIST", index: 0 });
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

  const renderArtistDetails = () => (
    <div className="flex flex-col">
      <div className="flex md:items-end md:flex-row flex-col pt-12 p-4">
        <div className="flex items-center justify-center">
          {artist.image ? (
            <img
              src={artist?.image[1].url}
              alt={artist?.name}
              className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
            />
          ) : (
            <BiSolidPlaylist size={100} color={"#59c2ef"} />
          )}
        </div>

        <div className="mt-8 md:ml-8">
          <h1 className="text-3xl md:text-7xl ubuntu-bold">
            {truncateString(artist?.name, 25)}
          </h1>
          {artist?.isVerified && (
            <div className="flex items-center">
              <MdVerified color="#59c2ef" size={isMobile ? 18 :25} />
              <p className="text-sm md:text-lg ml-2">Verified Artist</p>
            </div>
          )}
          <div className="flex items-center mt-1">
            <p className="text-sm">
              {" "}
              <span className="text-xs">{artist?.followerCount}</span> Followers
            </p>
          </div>
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
      {artist?.topSongs.map((song, index) => (
        <div
          key={song.id}
          className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
          onClick={() =>
            playlist.songs.length > 0 && playlist.id === artist.id
              ? playSongByIndex(index)
              : playSong(song.id)
          }
        >
          <div className="flex items-center">
            <div className="mr-2">
              <h3>{index + 1}</h3>
            </div>
            <div className="flex items-center flex-1 ml-2">
              <img
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

                <div className="flex items-center">
                  <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">
                    {truncateString(
                      decodeHtmlEntities(song.album.name),
                      isMobile ? 30 : undefined
                    )}
                  </p>
                </div>
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
            {renderArtistDetails()}
            {renderSongsList()}
          </>
        )}
      </BlockWrapper>
    </Wrapper>
  );
};

export default Artist;
