import {FaPlay, FaPause} from "react-icons/fa";
import MusicSeek from "@/_components/Player/MusicSeek.jsx";
import Volume from "@/_components/Player/Volume.jsx";
import MusicInfo from "@/_components/Player/MusicInfo.jsx";
import {IoPlaySkipBack, IoPlaySkipForward} from "react-icons/io5";
import usePlayerStore from '@/store/use-player.js';
import {useRef} from "react";


const Player = () => {
    const {song, isPlaying, setIsPlaying} = usePlayerStore();

    const AudioRef = useRef();


    const handleAudioPlay = () => {
        if (AudioRef.current.paused) {
            AudioRef.current.play();
            setIsPlaying(true);
        } else {
            AudioRef.current.pause();
            setIsPlaying(false);
        }
    };


    return (<div
        className={"fixed bottom-0 bg-[#18181b]  border-t border-[#2D2E35]  left-0 w-full  pr-4 pl-4   rounded text-amber-50"}>
        <div className={"flex justify-between items-center"}>
            <div className={" flex-1"}>
                <MusicInfo song={song}/>
            </div>
            <div className={"flex flex-col justify-center items-center flex-1"}>
                <audio src={song?.downloadUrl[4].url} autoPlay ref={AudioRef}></audio>
                <div className={"m-2 mt-4 flex items-center justify-center"}>
                    <IoPlaySkipBack size={20} color="#4d4d4d" className={"mr-8 cursor-pointer"}/>

                    <div className={"bg-white mr-8 p-2 rounded-full flex items-center justify-center cursor-pointer"}
                         onClick={handleAudioPlay}>
                        {isPlaying ? <FaPause size={16} color={"black"}/> :
                            <FaPlay size={15} color={"black"} className={" relative left-[2px] "}/>}
                    </div>

                    <IoPlaySkipForward size={20} color="#4d4d4d" className={"cursor-pointer"}/>
                </div>
                <div className={"m-2"}>
                    <MusicSeek duration={600}/>
                </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
                <Volume/>
            </div>
        </div>
    </div>);
};

export default Player;
