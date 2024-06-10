import {FaPause, FaPlay} from "react-icons/fa";
import MusicSeek from "@/_components/Player/MusicSeek.jsx";
import Volume from "@/_components/Player/Volume.jsx";
import MusicInfo from "@/_components/Player/MusicInfo.jsx";
import {IoPlaySkipBack, IoPlaySkipForward} from "react-icons/io5";
import usePlayerStore from '@/store/use-player.js';
import {useEffect, useRef} from "react";
import useAuthStore from "@/store/use-auth.js";


const Player = () => {
    const {
        song, isPlaying, setIsPlaying, loadPlayerState, volume, setVolume, playNext, playPrevious
    } = usePlayerStore();
    const {isAuthenticated} = useAuthStore()

    const AudioRef = useRef();

    useEffect(() => {
        if (isAuthenticated) {
            (async function load() {
                await loadPlayerState();
            })();
        }
    }, [isAuthenticated, loadPlayerState]);

    useEffect(() => {
        const audio = AudioRef.current;
        const handleEnded = async () => {
            await playNext();
        };
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [playNext]);


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
        className={"fixed bottom-0 bg-[#18181b]  border-t border-[#2D2E35]  left-0 w-full  pr-4 pl-4   rounded text-amber-50 z-50"}>
        <div className={"flex justify-between items-center"}>
            <div className={"flex-1"}>
                <MusicInfo song={song}/>
            </div>
            <div className={"flex flex-col justify-center items-center flex-1"}>
                <audio src={song?.downloadUrl[4].url} autoPlay ref={AudioRef}></audio>
                <div className={" mt-4 flex items-center justify-center"}>
                    <IoPlaySkipBack size={20} className={"mr-8 cursor-pointer"} onClick={playPrevious}/>

                    <div className={"bg-white mr-8 p-2 rounded-full flex items-center justify-center cursor-pointer"}
                         onClick={handleAudioPlay}>
                        {isPlaying ? <FaPause size={16} color={"black"}/> :
                            <FaPlay size={15} color={"black"} className={" relative left-[2px] "}/>}
                    </div>

                    <IoPlaySkipForward size={20} className={"cursor-pointer"} onClick={playNext}/>
                </div>
                <div className={"m-2"}>
                    <MusicSeek AudioRef={AudioRef}/>
                </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
                <Volume AudioRef={AudioRef}/>
            </div>
        </div>
    </div>);
};

export default Player;
