import { FaPause, FaPlay } from "react-icons/fa";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  const { connectWebSocket, closeWebSocket, socket, setConnectionStatus } =
    useWebSocketStore();
  const { isAuthenticated, userId } = useAuthStore();
  const { isUserSyncVisible, showUserSync } = useUserSyncStore();
  const { isNotifierVisible, showNotifier } = useNotifierStore();

  // Use a state to store WebSocket message data and an error state
  const [wsData, setWsData] = useState(null);
  const [seekData, setWsSeekData] = useState(null);
  const [wsError, setWsError] = useState(null);

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
          console.log(data);

          switch (data.type) {
            case "CONNECTION_REQUEST":
              setWsData(data.payload);
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
              setWsSeekData(data.payload);
              break;
            default:
              console.warn("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
          setWsError("Error processing the server message.");
        }
      };

      socket.onerror = () => setWsError("WebSocket connection error.");
      socket.onclose = () => setWsError("WebSocket connection closed.");
    }
  }, [handleAudioPlay, playSong, setConnectionStatus, showNotifier, socket]);

  // Memoized AudioRef for better performance
  const memoizedAudioRef = useMemo(() => AudioRef, [AudioRef]);

  return (
    <div className="fixed bottom-0 bg-[#18181b] border-t border-[#2D2E35] left-0 w-full pr-4 pl-4 rounded text-amber-50 z-30">
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
          <div className="mt-4 flex items-center justify-center">
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
          <div className="m-2">
            <MusicSeek AudioRef={memoizedAudioRef} seekData={seekData} />
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center">
          <div className="mr-5 relative">
            <HiUsers size={22} cursor={"pointer"} onClick={showUserSync} />
            {isUserSyncVisible && <UserSync />}
          </div>
          {isNotifierVisible && <UserNotifier data={wsData} error={wsError} />}
          <Volume AudioRef={memoizedAudioRef} />
        </div>
      </div>
    </div>
  );
};

export default Player;
