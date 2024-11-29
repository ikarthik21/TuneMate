import { FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import usePlayerStore from "@/store/use-player.js";

// eslint-disable-next-line react/prop-types
const VolumeSlider = () => {
  const { volume, setVolume, AudioRef } = usePlayerStore();

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    AudioRef.current.volume = newVolume / 100;
  };

  const handleMute = () => {
    if (volume > 0) {
      setVolume(0);
      AudioRef.current.volume = 0;
    } else {
      setVolume(50);
      AudioRef.current.volume = 0.5;
    }
  };

  const isMuted = volume === 0;

  return (
    <div className={"flex items-center justify-center"}>
      <div>
        {isMuted ? (
          <FaVolumeMute
            size={23}
            onClick={handleMute}
            className={"cursor-pointer"}
          />
        ) : (
          <FaVolumeDown
            size={23}
            onClick={handleMute}
            className={"cursor-pointer"}
          />
        )}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider ml-4"
        style={{
          background: `linear-gradient(to right, #0066C7 ${volume}%, #ccc ${volume}%)`
        }}
      />
    </div>
  );
};

export default VolumeSlider;
