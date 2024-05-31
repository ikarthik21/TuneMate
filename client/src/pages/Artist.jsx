import Wrapper from "@/pages/Wrapper.jsx";
import {useParams} from "react-router-dom";
import useSWR from "swr";
import MusicServiceInstance from "@/service/api/music_apis.js";
import {formatTime, truncateString} from "@/utils/MusicUtils.js";
import {MdVerified} from "react-icons/md";
import usePlayerStore from "@/store/use-player.js";

const Artist = () => {
    const {id} = useParams();
    const {playSong} = usePlayerStore();

    const {data: artist, error, isLoading} = useSWR(
        id ? ['artist', id] : null,
        () => MusicServiceInstance.getArtistById(id)
    );

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    const renderArtistDetails = () => (
        <div className="flex items-center">
            <div className="flex items-end pt-20 p-4">
                <img
                    src={artist?.image[1].url}
                    alt={artist?.name}
                    className="rounded-full transform transition-transform duration-500 hover:scale-105 h-44 w-44"
                />
                <div className="ml-8">
                    <h1 className="text-7xl ubuntu-bold">{truncateString(artist?.name, 15)}</h1>
                    {artist?.isVerified && (
                        <div className="flex items-center">
                            <MdVerified color="green" size={25}/>
                            <p className="ml-2">Verified Artist</p>
                        </div>
                    )}
                    <div className="flex items-center mt-1">
                        <p>{artist?.followerCount} Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSongsList = () => (
        <div className="flex flex-col mt-4 w-[50vw]">
            {artist?.topSongs.map((song, index) => (
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
                            <img src={song.image[1].url} alt={song.name} className="h-9 w-9 rounded"/>
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
                {renderArtistDetails()}
                {renderSongsList()}
            </div>
        </Wrapper>
    );
};

export default Artist;
