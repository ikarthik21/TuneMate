import {useState, useEffect} from 'react';

// eslint-disable-next-line react/prop-types
const MusicSeek = ({duration}) => {
    const [currentTime, setCurrentTime] = useState(0);

    // Update the current time of the song every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);


    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progress = (currentTime / duration) * 100;

    return (<div className="flex items-center justify-between w-full">
        <div className="text-sm text-gray-500 mr-2 ">{formatTime(currentTime)}</div>

        <div className="w-96 bg-gray-200 rounded-full  h-1">
            <div className="bg-blue-500 rounded-full h-full" style={{width: `${progress}%`}}></div>
        </div>

        <div className="text-sm text-gray-500 ml-2">{formatTime(duration)}</div>
    </div>);
};

export default MusicSeek;
