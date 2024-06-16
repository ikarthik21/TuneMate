import useSWR from "swr";
import {useParams} from "react-router-dom";
import tuneMateInstance from "@/service/api/api.js";
import Wrapper from "@/pages/Wrapper.jsx";
import usePlayerStore from "@/store/use-player.js";
import useAuthStore from "@/store/use-auth.js";
import useHover from '@/hooks/useHover.js';
import {decodeHtmlEntities, formatTime, truncateString} from "@/utils/MusicUtils.js";
import {FaPlay} from "react-icons/fa";
import {IoMdRemoveCircle} from "react-icons/io";
import {BiSolidPlaylist} from "react-icons/bi";
import useAddListStore from "@/store/use-addList.js";
import AddToPlaylist from "@/_components/Options/AddToPlaylist.jsx";

const UserPlaylists = () => {
    const {id} = useParams();
    const {playSong, loadPlaylist, playlist, playSongByIndex} = usePlayerStore();
    const {hoveredItemId, handleMouseEnter, handleMouseLeave} = useHover();
    const {isAuthenticated} = useAuthStore();
    const {isAddToPlaylistVisible, showAddToPlaylist} = useAddListStore();


    const {
        data: user_playlist, error, isLoading
    } = useSWR(id ? ['user-playlist', id] : null, () => tuneMateInstance.getUserPlaylist(id));


    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;


    const handlePlayWholeList = async () => {
        await loadPlaylist({id: id, type: "USER_PLAYLIST", index: 0});
    };

    const renderPlaylistDetails = () => (<div className="flex items-center">
        <div className="flex items-end pt-20 p-4 ">
            {user_playlist.image ? <img src={user_playlist?.image} alt="Image"
                                        className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"/> :
                <BiSolidPlaylist size={100} color={"#59c2ef"}/>}
            <div className="ml-8 flex items-start flex-col">
                <h1 className="text-7xl ubuntu-bold">{user_playlist.name}</h1>
                <p className="mt-4 ml-4">{user_playlist.songs ? user_playlist.songs.length : 0} Songs</p>
            </div>
        </div>
    </div>);


    const renderSongsList = () => (<div className={"flex flex-col"}>

        <div className={"items-center flex "}>
            <div
                className={"p-4 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"}
                onClick={handlePlayWholeList}>
                <FaPlay size={14} color={"black"} className={"relative  left-[2px]"}/>
            </div>
        </div>

        {isAuthenticated && (<div className="flex flex-col mt-4 w-[50vw] mb-5">

            {user_playlist.songs?.length > 0 ? (user_playlist.songs.map((song, index) => (<div
                key={song.id + index}
                className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
                onClick={() => (playlist.songs.length > 0 && playlist.id === user_playlist.id) ? playSongByIndex(index) : playSong(song.id)}
                onMouseEnter={() => handleMouseEnter(song.id)}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-center">
                    <div className="mr-2">
                        <h3>{index + 1}</h3>
                    </div>
                    <div className="flex items-center flex-1 ml-2">
                        <img src={song.image} alt={song.name} className="h-9 w-9 rounded"/>
                        <div className="flex flex-col ml-4">
                            <h1 className="nunito-sans-bold">
                                {truncateString(decodeHtmlEntities(song.name))}
                            </h1>
                            <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">
                                {truncateString(decodeHtmlEntities(song.artists))}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className={"absolute"}>
                            {hoveredItemId === song.id && (<IoMdRemoveCircle
                                color="#59c2ef"
                                size={20}
                                onClick={() => showAddToPlaylist(song.id)}
                            />)}
                            {isAddToPlaylistVisible && song.id === hoveredItemId && <AddToPlaylist/>}
                        </div>
                        <div>
                            <p className="ml-4">{formatTime(song.duration)}</p>
                        </div>
                    </div>
                </div>
            </div>))) : (<div className="flex items-center min-h-48 justify-center">
                <h1>No Songs added</h1>
            </div>)}
        </div>)}
    </div>);

    return (<Wrapper>
        {renderPlaylistDetails()}
        {renderSongsList()}
    </Wrapper>);
};

export default UserPlaylists;