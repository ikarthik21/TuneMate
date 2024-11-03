/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { formatTime } from "@/utils/MusicUtils.js";
import useWebSocketStore from "@/store/use-socket";
import useAuthStore from "@/store/use-auth";
import usePlayerStore from "@/store/use-player.js";

const MusicSeek = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { socket, connectionStatus, musicSeekTime } = useWebSocketStore();
  const { userId } = useAuthStore();
  const AudioRef = usePlayerStore((state) => state.AudioRef);

  useEffect(() => {
    if (AudioRef.current) {
      const handleTimeUpdate = () => {
        setCurrentTime(AudioRef.current.currentTime);
      };
      const handleLoadedMetadata = () => {
        setDuration(AudioRef.current.duration);
      };
      AudioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      AudioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, [AudioRef]);

  useEffect(() => {
    if (musicSeekTime) {
      AudioRef.current.currentTime = musicSeekTime;
      setCurrentTime(musicSeekTime);
    }
  }, [AudioRef, musicSeekTime]);

  const handleSeek = (e) => {
    if (AudioRef.current) {
      const newTime = (e.target.value / 100) * duration;
      AudioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      if (socket && connectionStatus) {
        socket.send(
          JSON.stringify({
            type: "SYNC_ACTION",
            payload: {
              action: "SEEK",
              senderId: userId,
              time: newTime
            }
          })
        );
      }
    }
  };

  return (
    <div className="flex items-center">
      <span className="text-sm mr-2">{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={(currentTime / duration) * 100 || 0}
        onChange={handleSeek}
        className="w-96 h-1 bg-gray-300 rounded-lg cursor-pointer"
      />
      <span className="text-sm ml-2">{formatTime(duration)}</span>
    </div>
  );
};

export default MusicSeek;
