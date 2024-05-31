import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {formatTime} from '@/utils/MusicUtils.js';


const MusicSeek = ({AudioRef}) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (AudioRef.current) {
            const handleTimeUpdate = () => {
                setCurrentTime(AudioRef.current.currentTime);
            };
            const handleLoadedMetadata = () => {
                setDuration(AudioRef.current.duration);
            };
            AudioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            AudioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

        }
    }, [AudioRef]);

    const handleSeek = (e) => {
        if (AudioRef.current) {
            const newTime = (e.target.value / 100) * duration;
            AudioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    return (<div className="flex items-center">
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
    </div>);
};


MusicSeek.propTypes = {
    AudioRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }).isRequired
};

export default MusicSeek;
