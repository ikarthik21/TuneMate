import { FaPause, FaPlay } from "react-icons/fa";
import { useEffect, useCallback, useMemo } from "react";
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
import { encryptUserId } from "@/utils/MusicUtils.js";
import tuneMateInstance from "@/service/api/api";

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
    playSong,
    setMusicSeekTime
  } = usePlayerStore();

  const {
    connectWebSocket,
    closeWebSocket,
    socket,
    setConnectionStatus,
    setUserDetails
  } = useWebSocketStore();

  const { isAuthenticated, userId } = useAuthStore();

  const { isUserSyncVisible, showUserSync, hideUserSync } = useUserSyncStore();
  const { isNotifierVisible, showNotifier } = useNotifierStore();

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

  useEffect(() => {
    if (userId) {
      connectWebSocket(encryptUserId(userId));
    }
    return () => {
      closeWebSocket();
    };
  }, [userId, connectWebSocket, closeWebSocket]);

  const handleSocketMessage = useCallback(
    async (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "CONNECTION_REQUEST":
            setUserDetails(data.payload);
            hideUserSync();
            showNotifier();
            break;
          case "CONNECTION_DECLINED":
            Toast({
              type: "error",
              message: `${data.payload.declinedBy} declined to connect`
            });
            break;
          case "INVALID_ACTION":
            Toast({
              type: "error",
              message: `${data.payload.message} `
            });
            break;
          case "CONNECTION_ACCEPTED":
            try {
              setUserDetails(data.payload);
              await tuneMateInstance.updateSyncState(data.payload);
              setConnectionStatus(true);
              Toast({
                type: "success",
                message: `${data.payload.username} accepted`
              });
            } catch (error) {
              console.error("Error handling connection acceptance:", error);
              Toast({
                type: "error",
                message:
                  "Failed to process connection acceptance. Please try again."
              });
            }
            break;
          case "PLAY_SONG":
            await playSong(data.payload.songId, false);
            break;
          case "HANDLE_SONG_PLAY":
            await handleAudioPlay(false);
            break;
          case "SEEK":
            setMusicSeekTime(data.payload.musicSeekTime, false);
            break;
          case "CLOSE_CONNECTION":
            setUserDetails(null);
            await tuneMateInstance.updateSyncState({
              userId: "",
              username: ""
            });
            hideUserSync();
            break;
          default:
            console.warn("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [
      handleAudioPlay,
      playSong,
      setConnectionStatus,
      setMusicSeekTime,
      setUserDetails,
      showNotifier
    ]
  );

  useEffect(() => {
    if (socket) {
      socket.onmessage = handleSocketMessage;
      socket.onerror = () => console.log("WebSocket connection error.");
      socket.onclose = () => console.log("WebSocket connection closed.");
    }
  }, [socket, handleSocketMessage]);

  useEffect(() => {
    handleAudioPlay();
  }, [handleAudioPlay]);

  const UserSyncMemoized = useMemo(() => <UserSync />, [isUserSyncVisible]);
  const UserNotifierMemoized = useMemo(
    () => <UserNotifier />,
    [isNotifierVisible]
  );

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
            ref={AudioRef}
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
              <MusicSeek />
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-end items-center relative">
          <div className="mr-5 ">
            <HiUsers size={22} cursor={"pointer"} onClick={showUserSync} />
            {isUserSyncVisible && UserSyncMemoized}
          </div>
          {isNotifierVisible && UserNotifierMemoized}
          <Volume />
        </div>
      </div>
    </div>
  );
};

export default Player;
