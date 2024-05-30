import {FaVolumeDown} from "react-icons/fa";
import {FaVolumeMute} from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const VolumeSlider = ({volume, handleVolumeChange, handleMute}) => {
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
                className="h-1 slider ml-4"
                style={{
                    background: `linear-gradient(to right, #59c2ef ${volume}%, #ccc ${volume}%)`
                }}
            />
        </div>
    );
};

export default VolumeSlider;
