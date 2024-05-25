import {FaPlay} from "react-icons/fa";
import MusicSeek from "@/_components/Player/MusicSeek.jsx";
import Volume from "@/_components/Player/Volume.jsx";
import MusicInfo from "@/_components/Player/MusicInfo.jsx";
import {IoPlaySkipBack, IoPlaySkipForward} from "react-icons/io5";

const Player = () => {
    return (<div
        className={"fixed bottom-0 bg-[#18181b]  border-t border-[#2D2E35]  left-0 w-full  pr-4 pl-4   rounded text-amber-50"}>
        <div className={"flex justify-between"}>
            <div className={" flex-1"}>
                <MusicInfo/>
            </div>
            <div className={"flex flex-col justify-center items-center flex-1"}>
                <div className={"m-2 mt-4 flex items-center justify-center"}>
                    <IoPlaySkipBack size={20} className={"mr-8 cursor-pointer"}/>
                    <FaPlay size={25} className={"mr-8 cursor-pointer"}/>
                    <IoPlaySkipForward size={20} className={"cursor-pointer"}/>
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
