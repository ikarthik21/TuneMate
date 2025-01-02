/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { formatTime } from "@/utils/MusicUtils.js";
import usePlayerStore from "@/store/use-player.js";

const MusicSeek = () => {
  const {
    AudioRef,
    setMusicSeekTime,
    currentTime,
    setCurrentTime,
    duration,song,
    setDuration
  } = usePlayerStore();

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
  }, [AudioRef, song?.downloadUrl]);

  const handleSeek = (e) => {
    setMusicSeekTime(e.target.value);
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
