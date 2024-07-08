import useSWR from "swr";
import {useParams} from "react-router-dom";
import tuneMateInstance from "@/service/api/api.js";
import Wrapper from "@/pages/Wrapper.jsx";
import usePlayerStore from "@/store/use-player.js";
import {decodeHtmlEntities, formatRelativeTime, formatTime, truncateString} from "@/utils/MusicUtils.js";
import {FaPause, FaPlay} from "react-icons/fa";
import {BiSolidPlaylist} from "react-icons/bi";
import useAddListStore from "@/store/use-addList.js";
import {useEffect, useState} from "react";
import useHover from "@/hooks/useHover.js";
import useClick from "@/hooks/useClick.js";
import {IoMdRemoveCircle} from "react-icons/io";
import AddToPlaylist from "@/_components/Options/AddToPlaylist.jsx";

const UserPlaylists = () => {
    const {id} = useParams();
    const {playSong, loadPlaylist, playlist, playSongByIndex, handleAudioPlay} = usePlayerStore();
    const {isAddToPlaylistVisible, showAddToPlaylist, component} = useAddListStore();
    const [selectedSongId, setSelectedSongId] = useState(null);
    const {hoveredItemId, handleMouseEnter, handleMouseLeave} = useHover();
    const {clickedItemId, setClickedItemId} = useClick();
    const [isScrolled, setIsScrolled] = useState(false);

    const {
        isPlaying, songId
    } = usePlayerStore();

    const {
        data: user_playlist, error, isLoading
    } = useSWR(id ? ['user-playlist', id] : null, () => tuneMateInstance.getUserPlaylist(id));

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 350);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    const handlePlayWholeList = async () => {
        await loadPlaylist({id: id, type: "USER_PLAYLIST", index: 0});
    };

    const handleShowLists = (e, songId) => {
        e.stopPropagation();
        setSelectedSongId(songId);
        showAddToPlaylist(songId, "USER_LIST");
    }

    const renderPlaylistDetails = () => (<div className="flex flex-col">
        <div className="flex items-end pt-20 p-4">
            {user_playlist.image ? (<img src={user_playlist?.image} alt="Image"
                                         className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"/>) : (
                <BiSolidPlaylist size={100} color={"#59c2ef"}/>)}
            <div className="ml-8 flex items-start flex-col">
                <h1 className="text-7xl ubuntu-bold ">{user_playlist.name}</h1>
                <p className="mt-4 ml-4">{user_playlist.songs ? user_playlist.songs.length : 0} Songs</p>
            </div>
        </div>
        <div className={"items-center flex "}>
            <div
                className={"p-4 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"}
                onClick={handlePlayWholeList}>
                <FaPlay size={14} color={"black"} className={"relative left-[2px]"}/>
            </div>
        </div>
    </div>);

    const renderSongsList = () => (<div className={"flex flex-col"}>
        {/* On Scroll NAV */}
        {isScrolled && (
            <div className={"items-center flex bg-[#0e0e10] z-40 w-[60vw] sticky top-[70px] left-0 rounded"}>
                <div
                    className={"p-3 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"}
                    onClick={handlePlayWholeList}>
                    <FaPlay size={15} color={"black"} className={"relative left-[2px]"}/>
                </div>
                <div className={"flex items-center ml-4"}>
                    {user_playlist.image ? (<img src={user_playlist?.image} alt="Image"
                                                 className="rounded transform transition-transform duration-500 hover:scale-105 h-11 w-11"/>) : (
                        <BiSolidPlaylist size={100} color={"#59c2ef"}/>)}
                    <h1 className="text-2xl ubuntu-bold ml-4">{user_playlist.name}</h1>
                </div>
            </div>)}

        <div className="flex flex-col mt-4 w-[60vw] mb-5 z-30">
            {/*Song Meta Header */}
            <div className="grid grid-cols-10 gap-4 p-3 rounded bg-[#1b1b1b] sticky top-[138px] left-0 z-40 mb-2">
                <div className="col-span-1 flex justify-center items-center">
                    <h3>#</h3>
                </div>
                <div className="col-span-3 flex items-center">
                    <h1 className="nunito-sans-bold">Title</h1>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                    <h1 className="nunito-sans-bold">Album</h1>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                    <p>Date Added</p>
                </div>
                <div className="col-span-1 flex justify-center items-center">
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <p>Duration</p>
                </div>
            </div>

            {/* Songs List */}
            {user_playlist.songs?.length > 0 ? (user_playlist.songs.map((song, index) => (<div
                key={song.id}
                className={`grid grid-cols-10 gap-4 m-1 p-3 rounded-xl ${clickedItemId === song.id ? "bg-[#1B1B1B]" : "hover:bg-[#2e2e34]"}`}
                onDoubleClick={() => (playlist.songs.length > 0 && playlist.id === user_playlist.id) ? playSongByIndex(index) : playSong(song.id)}
                onMouseEnter={() => handleMouseEnter(song.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setClickedItemId(song.id)}
            >
                <div className="col-span-1 flex justify-center items-center ">
                    {(hoveredItemId === song.id || clickedItemId === song.id) ? (songId === song.id ? (isPlaying ? (
                        <FaPause size={16} color={`${songId === song.id ? '#59c2ef' : 'white'}`}
                                 onClick={handleAudioPlay}/>) : (
                        <FaPlay size={13} color={`${songId === song.id ? '#59c2ef' : 'white'}`}
                                className="relative left-[2px]" onClick={handleAudioPlay}/>)) : (
                        <FaPlay size={13} color="white" className="relative left-[2px]"
                                onClick={() => (playlist.songs.length > 0 && playlist.id === user_playlist.id) ? playSongByIndex(index) : playSong(song.id)}/>)) : (
                        <h3 className={`${songId === song.id ? 'text-[#59c2ef]' : ''}`}>{index + 1}</h3>)}
                </div>
                <div className="col-span-3 flex items-center">
                    <img src={song.image} alt={song.name} className="h-9 w-9 rounded"/>
                    <div className="flex flex-col ml-4">
                        <h1 className={`nunito-sans-bold ${songId === song.id ? 'text-[#59c2ef]' : ''}`}>
                            {truncateString(decodeHtmlEntities(song.name), 15)}
                        </h1>
                        <p className="text-xs text-[#6a6a6a] nunito-sans-bold">
                            {truncateString(decodeHtmlEntities(song.artists), 15)}
                        </p>
                    </div>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                    <p className={`${songId === song.id ? 'text-[#59c2ef]' : 'text-white'} ml-4 text-sm`}>
                        {truncateString(decodeHtmlEntities(song.album), 15)}
                    </p>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                    <p className={`${songId === song.id ? 'text-[#59c2ef]' : 'text-white'} ml-4 text-sm`}>
                        {formatRelativeTime(song.addedAt)}
                    </p>
                </div>
                <div className="flex justify-center items-center">
                    {hoveredItemId === song.id && (<IoMdRemoveCircle color="#59c2ef" size={20}
                                                                     onClick={(e) => handleShowLists(e, song.id)}/>)}
                    <div className="relative">
                        {isAddToPlaylistVisible && song.id === selectedSongId && component === "USER_LIST" &&
                            <AddToPlaylist/>}
                    </div>
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <p className={`${songId === song.id ? 'text-[#59c2ef]' : 'text-white'} ml-4`}>
                        {formatTime(song.duration)}
                    </p>
                </div>
            </div>))) : (<div className="flex items-center min-h-48 justify-center">
                <h1>No Songs added</h1>
            </div>)}
        </div>
    </div>);

    return (<Wrapper>
        {renderPlaylistDetails()}
        {renderSongsList()}
    </Wrapper>);
};

export default UserPlaylists;
