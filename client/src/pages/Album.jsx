import Wrapper from "@/pages/Wrapper.jsx";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import {useParams} from "react-router-dom";
import {formatTime, truncateString, decodeHtmlEntities} from '@/utils/MusicUtils.js';
import usePlayerStore from "@/store/use-player.js";

const Album = () => {
    const {id} = useParams();
    const {playSong} = usePlayerStore();

    const {data: album, error, isLoading} = useSWR(
        id ? ['album', id] : null,
        () => MusicServiceInstance.getAlbumById(id)
    );

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    const renderAlbumDetails = () => (
        <div className="flex items-center">
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
        </div>
    );

    const renderSongsList = () => (
        <div className="flex flex-col mt-4 w-[50vw]">
            {album?.songs.map((song, index) => (
                <div
                    key={song.id}
                    className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
                    onClick={() => playSong(song.id)}
                >
                    <div className="flex items-center">
                        <div className="mr-2">
                            <h3>{index + 1}</h3>
                        </div>
                        <div className="flex flex-col flex-1 ml-2">
                            <h1 className="nunito-sans-bold">{decodeHtmlEntities(song.name)}</h1>
                            <div className="flex items-center">
                                {song.artists.primary.map(artist => (
                                    <p
                                        key={artist.id}
                                        className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold"
                                    >
                                        {artist.name}
                                    </p>
                                ))}
                            </div>
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
                {renderAlbumDetails()}
                {renderSongsList()}
            </div>
        </Wrapper>
    );
};

export default Album;
