import {useState} from "react";

const VolumeSlider = () => {
    const [volume, setVolume] = useState(50); // Initial volume set to 50

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        // Here you can add additional logic to control the volume
    };

    return (<div className={"flex items-center justify-center"}>
        <span className={"text-sm"}>{volume}</span>
        <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="h-1 slider ml-4"
        />
    </div>);
};

export default VolumeSlider;
