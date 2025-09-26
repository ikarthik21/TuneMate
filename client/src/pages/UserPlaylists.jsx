import { useLocation, useParams, useNavigate } from "react-router-dom";
import usePlayerStore from "@/store/use-player.js";
import useAddListStore from "@/store/use-addList.js";
import { useEffect, useState, useRef } from "react";
import useHover from "@/hooks/useHover.js";
import Wrapper from "@/pages/Wrapper.jsx";
import {
  decodeHtmlEntities,
  formatRelativeTime,
  formatTime,
  truncateString,
  formatPlayCount
} from "@/utils/MusicUtils.js";
import { IoMdRemoveCircle } from "react-icons/io";
import AddToPlaylist from "@/_components/Options/AddToPlaylist.jsx";
import { FaPause, FaPlay } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";
import useSWR from "swr"; // Import global mutate
import tuneMateInstance from "@/service/api/api.js";
import UserPlayListSkeleton from "@/_components/skeletons/UserPlayListSkeleton.jsx";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { useMediaQuery } from "usehooks-ts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useDropDownStore from "@/store/use-dropDownStore";
import UserPlayListModifyOptions from "@/_components/Options/UserPlayListModifyOptions";

const UserPlaylists = () => {
  const { id } = useParams();
  const {
    playSong,
    loadPlaylist,
    playlist,
    playSongByIndex,
    handleAudioPlay,
    setSongForPlayListDropdown
  } = usePlayerStore();
  const { isAddToPlaylistVisible, showAddToPlaylist, component } =
    useAddListStore();
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [clickEvent, setClickEvent] = useState(null);
  const { hoveredItemId, handleMouseEnter, handleMouseLeave } = useHover();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isPlaying, songId } = usePlayerStore();
  const location = useLocation();
  const isRecommended = location.pathname.startsWith("/recommended");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { showDropDown, components, hideDropDown } = useDropDownStore();
  const wrapperRef = useRef(null);

  const {
    data: single_playlist,
    error,
    isLoading,
    mutate
  } = useSWR(
    id
      ? isRecommended
        ? ["recommended-playlist", id]
        : ["user-playlist", id]
      : null,
    () =>
      isRecommended
        ? tuneMateInstance.getRecommendedPlaylist(id)
        : tuneMateInstance.getUserPlaylist(id)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };

    const handleClickOutside = (event) => {
      if (
        components["USER_PLAYLIST_OPTIONS"] &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        hideDropDown("USER_PLAYLIST_OPTIONS");
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [components, hideDropDown]);

  if (error)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  const handlePlayWholeList = async () => {
    await loadPlaylist({
      id: id,
      type: location.pathname.startsWith("/recommended")
        ? "RECOMMENDED_PLAYLIST"
        : "USER_PLAYLIST",
      index: 0
    });
  };

  const handleShowLists = (e, songId) => {
    e.stopPropagation();
    setClickEvent(e);
    setSelectedSongId(songId);
    showAddToPlaylist(songId, "USER_LIST");
  };

  const renderPlaylistDetails = () => (
    <div className="flex flex-col">
      <div className="flex md:items-end md:flex-row flex-col pt-12 p-4">
        <div className="flex items-center justify-center">
          {single_playlist.image ? (
            <LazyLoadImage
              effect="blur"
              wrapperProps={{
                style: { transitionDelay: "0.5s" }
              }}
              loading="lazy"
              src={single_playlist?.image}
              alt="Image"
              className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
            />
          ) : (
            <BiSolidPlaylist size={100} color={"#59c2ef"} />
          )}
        </div>

        <div className="md:ml-8 mt-4 flex items-start flex-col ">
          <h1 className="text-3xl md:text-7xl ubuntu-bold ">
            {truncateString(single_playlist.name, 15)}
          </h1>
          <p className="text-sm md:text-lg">
            {single_playlist.songs && single_playlist.songs.length == 1
              ? `${single_playlist.songs.length} Song`
              : `${single_playlist.songs.length} Songs`}
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

        {!isRecommended && (
          <div className="relative ml-4" ref={wrapperRef}>
            {" "}
            {/* relative wrapper */}
            <button
              className="text-white text-3xl font-medium mb-2 "
              onClick={() => {
                components["USER_PLAYLIST_OPTIONS"]
                  ? hideDropDown("USER_PLAYLIST_OPTIONS")
                  : showDropDown("USER_PLAYLIST_OPTIONS");
              }}
            >
              <h2>...</h2>
            </button>
            {components["USER_PLAYLIST_OPTIONS"] && (
              <UserPlayListModifyOptions single_playlist={single_playlist} />
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSongsList = () => (
    <div className={"flex flex-col pb-10 md:pb-0"}>
      {/* On Scroll NAV */}
      {isScrolled && (
        <div
          className={
            "flex items-center player-background z-30 sticky top-[70px] left-0 rounded"
          }
        >
          <div
            className={
              "p-3 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"
            }
            onClick={handlePlayWholeList}
          >
            <FaPlay
              size={15}
              color={"black"}
              className={"relative left-[2px]"}
            />
          </div>
          <div className={"flex items-center md:ml-4"}>
            {single_playlist.image ? (
              <LazyLoadImage
                effect="blur"
                wrapperProps={{
                  style: { transitionDelay: "0.5s" }
                }}
                loading="lazy"
                src={single_playlist?.image}
                alt="Image"
                className="rounded hidden md:block transform transition-transform duration-500 hover:scale-105 h-8 w-8 md:h-11 md:w-11"
              />
            ) : (
              <BiSolidPlaylist size={100} color={"#59c2ef"} />
            )}
            <h1 className="text-xl md:text-2xl ubuntu-bold ml-4">
              {isMobile
                ? truncateString(single_playlist.name, 20)
                : single_playlist.name}
            </h1>
          </div>
        </div>
      )}

      <div className="flex flex-col mt-4 mb-5">
        {/*Song Meta Header */}
        <div className="grid grid-cols-10 gap-4 p-3 rounded bg-[#252525] sticky top-[138px] left-0 z-30 mb-2">
          <div className="col-span-1 flex justify-center items-center">
            <h3>#</h3>
          </div>
          <div className="col-span-3 flex items-center">
            <h1 className="nunito-sans-bold">Title</h1>
          </div>
          <div className="hidden col-span-2 md:flex items-center justify-center">
            <h1 className="nunito-sans-bold">Album</h1>
          </div>
          <div className="col-span-2 hidden md:flex justify-center items-center">
            {isRecommended ? <p>Plays</p> : <p>Date Added</p>}
          </div>
          <div className="col-span-1 hidden md:flex justify-center items-center"></div>
          <div className="col-span-1 hidden md:flex justify-center items-center">
            <p>Duration</p>
          </div>
        </div>

        {/* Songs List */}
        {single_playlist.songs?.length > 0 ? (
          single_playlist.songs.map((song, index) => (
            <div
              key={song.id}
              className={`grid grid-cols-10 gap-4 m-1 p-3 rounded-xl `}
              onClick={() =>
                playlist.songs.length > 0 && playlist.id === single_playlist.id
                  ? playSongByIndex(index)
                  : playSong(song.id)
              }
              onMouseEnter={() => handleMouseEnter(song.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="col-span-1 flex justify-center items-center ">
                {hoveredItemId === song.id ? (
                  songId === song.id ? (
                    isPlaying ? (
                      <FaPause
                        size={16}
                        color={`${songId === song.id ? "#59c2ef" : "white"}`}
                        onClick={handleAudioPlay}
                      />
                    ) : (
                      <FaPlay
                        size={13}
                        color={`${songId === song.id ? "#59c2ef" : "white"}`}
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
                        playlist.id === single_playlist.id
                          ? playSongByIndex(index)
                          : playSong(song.id)
                      }
                    />
                  )
                ) : (
                  <h3
                    className={`${
                      songId === song.id ? "text-[#59c2ef]" : "text-sm"
                    }`}
                  >
                    {index + 1}
                  </h3>
                )}
              </div>
              <div className="md:col-span-3 col-span-9 flex items-center">
                <LazyLoadImage
                  effect="blur"
                  wrapperProps={{
                    style: { transitionDelay: "0.5s" }
                  }}
                  loading="lazy"
                  src={song.image}
                  alt={song.name}
                  className="h-9 w-9 rounded"
                />

                <div className="flex flex-col ml-4">
                  <h1
                    className={`nunito-sans-bold ${
                      songId === song.id ? "text-[#59c2ef]" : ""
                    }`}
                  >
                    {truncateString(
                      decodeHtmlEntities(song.name),
                      isMobile ? 25 : undefined
                    )}
                  </h1>
                  <p className="text-xs text-[#6a6a6a] nunito-sans-bold">
                    {truncateString(
                      decodeHtmlEntities(song.artists),
                      isMobile ? 30 : undefined
                    )}
                  </p>
                </div>
              </div>

              <div className="col-span-2 hidden md:flex justify-center items-center">
                <p
                  className={`${
                    songId === song.id ? "text-[#59c2ef]" : "text-white"
                  } ml-4 text-sm`}
                >
                  {truncateString(decodeHtmlEntities(song.album), 15)}
                </p>
              </div>
              <div className="col-span-2  hidden md:flex  justify-center items-center">
                <p
                  className={`${
                    songId === song.id ? "text-[#59c2ef]" : "text-white"
                  } ml-4 text-sm`}
                >
                  {isRecommended
                    ? formatPlayCount(song.playCount)
                    : formatRelativeTime(song.addedAt)}
                </p>
              </div>
              <div className="hidden md:flex justify-center items-center">
                <div
                  className="w-6 h-6 flex items-center justify-center transition-opacity duration-200"
                  title="Show playlists"
                >
                  <IoMdRemoveCircle
                    color="#59c2ef"
                    size={20}
                    onClick={(e) => {
                      setSongForPlayListDropdown(song);
                      handleShowLists(e, song.id);
                    }}
                    className={`${
                      hoveredItemId === song.id
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  />
                </div>

                <div className="relative">
                  {isAddToPlaylistVisible &&
                    song.id === selectedSongId &&
                    component === "USER_LIST" && (
                      <AddToPlaylist
                        clickEvent={clickEvent}
                        component={"USER_LIST"}
                        onPlaylistUpdate={mutate}
                      />
                    )}
                </div>
              </div>
              <div className="col-span-1  hidden md:flex   justify-center items-center">
                <p
                  className={`${
                    songId === song.id ? "text-[#59c2ef]" : "text-white"
                  } ml-4`}
                >
                  {formatTime(song.duration)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center min-h-48 justify-center">
            <h1>No Songs added</h1>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Wrapper>
      <BlockWrapper margin={"mb-8"}>
        {isLoading ? (
          <UserPlayListSkeleton count={10} />
        ) : (
          <div>
            {renderPlaylistDetails()}
            {renderSongsList()}
          </div>
        )}
      </BlockWrapper>
    </Wrapper>
  );
};

export default UserPlaylists;
