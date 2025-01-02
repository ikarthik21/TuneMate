import { FaPause, FaPlay } from "react-icons/fa";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { MdOutlineLoop } from "react-icons/md";
import { FaShuffle } from "react-icons/fa6";
import usePlayerStore from "@/store/use-player.js";

const MusicControls = () => {
  const {
    isPlaying,
    playNext,
    playPrevious,
    handleAudioPlay,
    onLoop,
    handleSongLoop,
    isShuffling,
    handleShuffle
  } = usePlayerStore();

  return (
    <div className="flex items-center election:justify-center justify-center">
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
          <FaPlay size={15} color="black" className="relative left-[2px]" />
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
  );
};

export default MusicControls;
