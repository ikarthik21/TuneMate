import { FaPause, FaPlay } from "react-icons/fa";
import { useEffect, useMemo, useCallback } from "react";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { MdOutlineLoop } from "react-icons/md";
import { FaShuffle } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import MusicSeek from "@/_components/Player/MusicSeek.jsx";
import Volume from "@/_components/Player/Volume.jsx";
import MusicInfo from "@/_components/Player/MusicInfo.jsx";
import UserSync from "../sync/UserSync";
import UserNotifier from "../sync/UserNotifier";
import usePlayerStore from "@/store/use-player.js";
import useAuthStore from "@/store/use-auth.js";
import useWebSocketStore from "@/store/use-socket";
import useUserSyncStore from "@/store/use-userSync";
import useNotifierStore from "@/store/use-Notifier";
import Toast from "@/utils/Toasts/Toast";

const Player = () => {
  const {
    song,
    isPlaying,
    getFavorites,
    loadPlayerState,
    playNext,
    playPrevious,
    AudioRef,
    handleAudioPlay,
    onLoop,
    handleSongLoop,
    isShuffling,
    handleShuffle,
    playSong
  } = usePlayerStore();
  const {
    connectWebSocket,
    closeWebSocket,
    socket,
    setConnectionStatus,
    setMusicSeekTime,
    setUserDetails
  } = useWebSocketStore();
  const { isAuthenticated, userId } = useAuthStore();
  const { isUserSyncVisible, showUserSync } = useUserSyncStore();
  const { isNotifierVisible, showNotifier } = useNotifierStore();

  // Memoized fetch functions
  const initializePlayerState = useCallback(async () => {
    try {
      await loadPlayerState();
      await getFavorites();
    } catch (error) {
      console.error("Error loading player state: ", error);
    }
  }, [loadPlayerState, getFavorites]);

  useEffect(() => {
    if (isAuthenticated) {
      initializePlayerState();
    }
  }, [initializePlayerState, isAuthenticated]);

  // Setup WebSocket Connection
  useEffect(() => {
    if (userId) {
      connectWebSocket(userId);
    }
    return () => {
      closeWebSocket();
    };
  }, [userId, connectWebSocket, closeWebSocket]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "CONNECTION_REQUEST":
              setUserDetails(data.payload);
              showNotifier();
              break;
            case "CONNECTION_DECLINED":
              Toast({
                type: "error",
                message: `${data.payload.declinedBy} declined`
              });
              break;
            case "CONNECTION_ACCEPTED":
              setConnectionStatus(true);
              Toast({
                type: "success",
                message: `${data.payload.acceptedBy} accepted`
              });
              break;
            case "PLAY_SONG":
              await playSong(data.payload.songId);
              break;
            case "HANDLE_SONG_PLAY":
              await handleAudioPlay();
              break;
            case "SEEK":
              setMusicSeekTime(data.payload.time);
              break;
            default:
              console.warn("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      socket.onerror = () => console.log("WebSocket connection error.");
      socket.onclose = () => console.log("WebSocket connection closed.");
    }
  }, [
    handleAudioPlay,
    playSong,
    setConnectionStatus,
    setMusicSeekTime,
    setUserDetails,
    showNotifier,
    socket
  ]);

  // Memoized AudioRef for better performance
  const memoizedAudioRef = useMemo(() => AudioRef, [AudioRef]);

  return (
    <div className="fixed bottom-0 left-0 w-full p-[0.6rem] rounded text-amber-50 z-30 player-background">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <MusicInfo song={song} />
        </div>

        <div className="flex flex-col justify-center items-center flex-1">
          <audio
            src={song?.downloadUrl[4]?.url}
            autoPlay
            ref={memoizedAudioRef}
          ></audio>

          <div className="flex items-center justify-center">
            <div className="mr-2 flex items-center justify-center">
              <FaShuffle
                size={18}
                className="mr-8 cursor-pointer"
                onClick={handleShuffle}
                color={isShuffling ? "#59c2ef" : ""}
              />
              <IoPlaySkipBack
                size={20}
                className="mr-8 cursor-pointer"
                onClick={playPrevious}
              />
              <div
                className="bg-white mr-8 p-2 rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleAudioPlay}
              >
                {isPlaying ? (
                  <FaPause size={16} color="black" />
                ) : (
                  <FaPlay
                    size={15}
                    color="black"
                    className="relative left-[2px]"
                  />
                )}
              </div>
              <IoPlaySkipForward
                size={20}
                className="cursor-pointer"
                onClick={playNext}
              />
              <MdOutlineLoop
                size={20}
                className="cursor-pointer ml-8"
                color={onLoop ? "#59c2ef" : ""}
                onClick={handleSongLoop}
              />
            </div>
            <div className="ml-12">
              <MusicSeek AudioRef={memoizedAudioRef} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center">
          <div className="mr-5 relative">
            <HiUsers size={22} cursor={"pointer"} onClick={showUserSync} />
            {isUserSyncVisible && <UserSync />}
          </div>
          {isNotifierVisible && <UserNotifier />}
          <Volume AudioRef={memoizedAudioRef} />
        </div>
      </div>
    </div>
  );
};

export default Player;
