import React, { useEffect } from "react";
import usePlayerStore from "@/store/use-player.js";
import { FaPause, FaPlay } from "react-icons/fa";
import useMobileScreen from "@/store/use-MobileScreen";
import {
  decodeHtmlEntities,
  getAllArtists,
  truncateString,
  formatTime
} from "@/utils/MusicUtils.js";
import MusicSeek from "../MusicSeek";
import MusicControls from "../MusicControls";
import { MdFavorite } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import useAddListStore from "@/store/use-addList.js";
import useAuthStore from "@/store/use-auth.js";
import AddToPlaylist from "@/_components/Options/AddToPlaylist.jsx";

import AdminAddToPlaylist from "@/_components/admin/AdminAddToPlaylist.jsx";

const MobileController = () => {
  const { song, isPlaying, handleAudioPlay, AudioRef, Favorites, setDuration } =
    usePlayerStore();
  const { isAuthenticated, role } = useAuthStore();
  const { isFullScreen, openFullScreen, closeFullScreen } = useMobileScreen();
  const { isAddToPlaylistVisible, showAddToPlaylist, component } =
    useAddListStore();

  // Handle audio play state change
  useEffect(() => {
    handleAudioPlay();
  }, [handleAudioPlay]);

  return (
    <>
      {/* Persistent Audio Element */}
      <audio
        src={song?.downloadUrl[4]?.url}
        autoPlay
        ref={AudioRef}
        onLoadedMetadata={() => {
          if (AudioRef.current) {
            setDuration(AudioRef.current.duration);
          }
        }}
      ></audio>

      {/* Mobile Player Controller */}
      <div
        className={`fixed bottom-16 right-1 left-0 w-full p-[0.6rem] z-30 player-background rounded-xl  `}
        onClick={(e) => {
          openFullScreen();
        }}
      >
        {!!song && (
          <div className="flex justify-between items-center">
            {/* Song Info */}
            <div className="flex items-center">
              <img
                src={song?.image[1]?.url}
                alt={`song img`}
                className="h-12 w-12 rounded-md"
              />
              <div className="flex flex-col ml-4">
                <h3 className="text-lg nunito-sans-bold">
                  {truncateString(decodeHtmlEntities(song?.name), 20)}
                </h3>
                <p className="text-xs">
                  {truncateString(decodeHtmlEntities(getAllArtists(song)), 25)}
                </p>
              </div>
            </div>

            {/* Play/Pause Button */}
            <div
              className="mr-2"
              onClick={(e) => {
                e.stopPropagation();
                handleAudioPlay();
              }}
            >
              {isPlaying ? (
                <FaPause size={20} color="white" />
              ) : (
                <FaPlay size={20} color="white" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Player */}
      {isFullScreen && (
        <div className="fixed top-0 left-0 w-full h-full player-background z-50">
          <div className="flex flex-col justify-center  w-full h-full">
            {/* Close Player  */}
            <div>
              <button
                className="text-white h-24 w-24 text-3xl"
                onClick={closeFullScreen}
              >
                &times;
              </button>
            </div>
            <div className="flex justify-center flex-col w-full h-full ">
              {/* Music Controller */}
              <div className="flex flex-col items-center">
                <div>
                  <img
                    src={song?.image[2].url}
                    alt={`song image`}
                    className="h-56 w-64 rounded-xl mb-4"
                  />
                </div>
              </div>

              {/* Music Info */}
              <div className="pl-8 pr-8 mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold tracking-wide">
                    {truncateString(decodeHtmlEntities(song?.name), 20)}
                  </h3>
                  <p className="text-sm text-white">
                    {truncateString(
                      decodeHtmlEntities(getAllArtists(song)),
                      20
                    )}
                  </p>
                </div>
                <div>
                  {Favorites.includes(song.id) ? (
                    <MdFavorite
                      size={22}
                      cursor={"pointer"}
                      color={"#59c2ef"}
                      onClick={() => {
                        showAddToPlaylist(song.id, "MUSIC_INFO");
                      }}
                    />
                  ) : (
                    <IoMdAddCircle
                      size={22}
                      cursor={"pointer"}
                      color={"#59c2ef"}
                      onClick={() => showAddToPlaylist(song.id, "MUSIC_INFO")}
                    />
                  )}
                  {isAddToPlaylistVisible &&
                    component === "MUSIC_INFO" &&
                    role === "user" && <AddToPlaylist />}
                  {isAddToPlaylistVisible &&
                    component === "MUSIC_INFO" &&
                    role === "admin" && <AdminAddToPlaylist />}
                </div>
              </div>

              {/* Music Seek Bar */}
              <div className="m-4">
                <MusicSeek />
              </div>

              <div className="m-2">
                <MusicControls />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileController;
