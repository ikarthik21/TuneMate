import { useParams } from "react-router-dom";
import usePlayerStore from "@/store/use-player.js";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import { truncateString, decodeHtmlEntities, formatTime } from "@/utils/MusicUtils.js";
import Wrapper from "@/pages/Wrapper.jsx";

const Playlist = () => {
    const { id } = useParams();
    const { playSong } = usePlayerStore();

    const { data: playlist, error, isLoading } = useSWR(
        id ? ['playlist', id] : null,
        () => MusicServiceInstance.getPlaylistById(id)
    );

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    const renderPlaylistDetails = () => (
        <div className="flex items-center">
            <div className="flex items-end pt-20 p-4">
                <img
                    src={playlist?.image[1].url}
                    alt={playlist?.name}
                    className="rounded transform transition-transform duration-500 hover:scale-105 h-40 w-40"
                />
                <div className="ml-8">
                    <h1 className="text-7xl ubuntu-bold">
                        {truncateString(decodeHtmlEntities(playlist?.name), 15)}
                    </h1>
                    <p className="mt-4">{decodeHtmlEntities(playlist?.description)}</p>
                    <p>{playlist?.songCount} Songs</p>
                </div>
            </div>
        </div>
    );

    const renderSongsList = () => (
        <div className="flex flex-col mt-4 w-[50vw]">
            {playlist?.songs.map((song, index) => (
                <div
                    key={song.id}
                    className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
                    onClick={() => playSong(song.id)}
                >
                    <div className="flex items-center">
                        <div className="mr-2">
                            <h3>{index + 1}</h3>
                        </div>
                        <div className="flex items-center flex-1 ml-2">
                            <img src={song.image[1].url} alt={song.name} className="h-9 w-9 rounded" />
                            <h1 className="nunito-sans-bold ml-4">{song.name}</h1>
                        </div>
                        <div className="flex items-center">
                            <p>{formatTime(song.duration)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Wrapper>
            <div className="flex flex-col mb-8">
                {renderPlaylistDetails()}
                {renderSongsList()}
            </div>
        </Wrapper>
    );
};

export default Playlist;
