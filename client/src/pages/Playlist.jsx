import {useParams} from "react-router-dom";
import usePlayerStore from "@/store/use-player.js";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import {decodeHtmlEntities, formatTime, truncateString} from "@/utils/MusicUtils.js";
import Wrapper from "@/pages/Wrapper.jsx";
import {FaPlay} from "react-icons/fa";

const Playlist = () => {
    const {id} = useParams();
    const {playSong, loadPlaylist, playlist, playSongByIndex} = usePlayerStore();

    const {
        data: PlayList, error, isLoading
    } = useSWR(id ? ['playlist', id] : null, () => MusicServiceInstance.getPlaylistById(id));

    const handlePlayWholeList = async (id) => {
        await loadPlaylist({id, type: "PLAYLIST", index: 0});
    };


    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    const renderPlaylistDetails = () => (<div className="flex items-center">
        <div className="flex items-end pt-20 p-4">
            <img
                src={PlayList?.image[1].url}
                alt={PlayList?.name}
                className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
            />
            <div className="ml-8">
                <h1 className="text-7xl ubuntu-bold">
                    {truncateString(decodeHtmlEntities(PlayList?.name), 15)}
                </h1>
                <p className="mt-4">{decodeHtmlEntities(PlayList?.description)}</p>
                <p>{PlayList?.songCount} Songs</p>
            </div>
        </div>
    </div>);


    const renderSongsList = () => (<div className="flex flex-col mt-4 w-[50vw]">
        <div className={"items-center flex "}>
            <div
                className={"p-4 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"}
                onClick={() => handlePlayWholeList(PlayList.id)}>
                <FaPlay size={14} color={"black"} className={"relative  left-[2px]"}/>
            </div>
        </div>

        {PlayList?.songs.map((song, index) => (<div
            key={song.id}
            className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
            onClick={() => (playlist.songs.length > 0 && playlist.id === PlayList.id) ? playSongByIndex(index) : playSong(song.id)}

        >
            <div className="flex items-center">
                <div className="mr-2">
                    <h3>{index + 1}</h3>
                </div>
                <div className="flex items-center flex-1 ml-2">
                    <img src={song.image[1].url} alt={song.name} className="h-9 w-9 rounded"/>
                    <h1 className="nunito-sans-bold ml-4"> {truncateString(decodeHtmlEntities(song?.name))}</h1>
                </div>
                <div className="flex items-center">
                    <p>{formatTime(song.duration)}</p>
                </div>
            </div>
        </div>))}
    </div>);

    return (<Wrapper>
        <div className="flex flex-col mb-8">
            {renderPlaylistDetails()}
            {renderSongsList()}
        </div>
    </Wrapper>);
};

export default Playlist;
