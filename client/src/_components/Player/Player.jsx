import { FaPause, FaPlay } from "react-icons/fa";
import MusicSeek from "@/_components/Player/MusicSeek.jsx";
import Volume from "@/_components/Player/Volume.jsx";
import MusicInfo from "@/_components/Player/MusicInfo.jsx";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { MdOutlineLoop } from "react-icons/md";
import { FaShuffle } from "react-icons/fa6";
import usePlayerStore from '@/store/use-player.js';
import { useEffect } from "react";
import useAuthStore from "@/store/use-auth.js";

const Player = () => {
    const {
        song, isPlaying, getFavorites, loadPlayerState, playNext, playPrevious, AudioRef, handleAudioPlay, onLoop,
        handleSongLoop, isShuffling, handleShuffle
    } = usePlayerStore();
    const { isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated) {
            (async function load() {
                await loadPlayerState();
                await getFavorites();

            })();
        }
    }, [getFavorites, isAuthenticated, loadPlayerState]);

    useEffect(() => {
        handleAudioPlay();
    }, [handleAudioPlay]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Space") {
                event.preventDefault();  // Prevent default space behavior (like scrolling)
                handleAudioPlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleAudioPlay]);


    return ((<div
        className="fixed bottom-0 bg-[#18181b] border-t border-[#2D2E35] left-0 w-full pr-4 pl-4 rounded text-amber-50 z-30">
        <div className="flex justify-between items-center">
            <div className="flex-1">
                {<MusicInfo song={song} />}
            </div>

            <div className="flex flex-col justify-center items-center flex-1">
                <audio src={song?.downloadUrl[4].url} autoPlay ref={AudioRef}></audio>
                <div className="mt-4 flex items-center justify-center">

                    <FaShuffle size={18} className="mr-8 cursor-pointer" onClick={handleShuffle}
                        color={isShuffling ? "#59c2ef" : ""} />
                    <IoPlaySkipBack size={20} className="mr-8 cursor-pointer" onClick={playPrevious} />

                    <div
                        className="bg-white mr-8 p-2 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={handleAudioPlay}>
                        {isPlaying ? <FaPause size={16} color="black" /> :
                            <FaPlay size={15} color="black" className="relative left-[2px]" />}
                    </div>
                    <IoPlaySkipForward size={20} className="cursor-pointer" onClick={playNext} />

                    <MdOutlineLoop size={20} className="cursor-pointer ml-8" color={onLoop ? "#59c2ef" : ""}
                        onClick={handleSongLoop} />

                </div>
                <div className="m-2">
                    <MusicSeek AudioRef={AudioRef} />
                </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
                <Volume AudioRef={AudioRef} />
            </div>
        </div>
    </div>));
};

export default Player;
