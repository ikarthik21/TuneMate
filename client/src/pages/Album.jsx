import Wrapper from "@/pages/Wrapper.jsx";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import {useParams} from "react-router-dom";
import {decodeHtmlEntities, formatTime, truncateString} from '@/utils/MusicUtils.js';
import usePlayerStore from "@/store/use-player.js";
import {FaPlay} from "react-icons/fa";
import UserPlayListSkeleton from "@/_components/skeletons/UserPlayListSkeleton.jsx";

const Album = () => {
    const {id} = useParams();
    const {playSong, playlist, loadPlaylist, playSongByIndex} = usePlayerStore();
    const {
        data: album, error, isLoading
    } = useSWR(id ? ['album', id] : null, () => MusicServiceInstance.getAlbumById(id));


    const handlePlayWholeList = async () => {
        await loadPlaylist({id: album?.id, type: "ALBUM", index: 0});
    };


    const allArtists = (artists) => {
        let str = "";
        artists.map(artist => str += artist.name)
        return str;
    }

    if (error) return <div><h1>Error.....</h1></div>;

    const renderAlbumDetails = () => (<div className="flex items-center">
        <div className="flex items-end pt-20 p-4">
            <img
                src={album?.image[1].url}
                alt={album?.name}
                className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
            />
            <div className="ml-8">
                <h1 className="text-7xl ubuntu-bold">{truncateString(decodeHtmlEntities(album?.name), 15)}</h1>
                <p className="mt-4">{album?.description}</p>
                <p>{album?.songCount} Songs</p>
            </div>
        </div>
    </div>);

    const renderSongsList = () => (<div className="flex flex-col mt-4">

        <div className={"items-center flex "}>
            <div
                className={"p-4 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer ml-8 mt-4 mb-4"}
                onClick={handlePlayWholeList}>
                <FaPlay size={14} color={"black"} className={"relative  left-[2px]"}/>
            </div>
        </div>

        {album?.songs.map((song, index) => (<div
            key={song.id}
            className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
            onClick={() => (playlist.songs.length > 0 && playlist.id === album.id) ? playSongByIndex(index) : playSong(song.id)}

        >
            <div className="flex items-center">
                <div className="mr-2">
                    <h3>{index + 1}</h3>
                </div>
                <div className="flex flex-col flex-1 ml-2">
                    <h1 className="nunito-sans-bold">{decodeHtmlEntities(song.name)}</h1>
                    <div className="flex items-center">
                        <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">{truncateString(allArtists(album.artists.primary))}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <p>{formatTime(song.duration)}</p>
                </div>
            </div>
        </div>))}
    </div>);

    return (<Wrapper>
        {isLoading ? <UserPlayListSkeleton count={10}/> : <>
            {renderAlbumDetails()}
            {renderSongsList()}
        </>}
    </Wrapper>);
};

export default Album;
