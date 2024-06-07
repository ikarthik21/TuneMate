import {decodeHtmlEntities, formatTime, truncateString} from "@/utils/MusicUtils.js";
import useSWR, {mutate} from "swr";
import tuneMateInstance from "@/service/api/api.js";
import usePlayerStore from "@/store/use-player.js";
import Wrapper from "@/pages/Wrapper.jsx";
import {IoMdRemoveCircle} from "react-icons/io";
import useHover from "@/hooks/useHover.js";
import FavoritesLogo from '@/assets/images/favorites.png';

const Favorites = () => {
    const {playSong} = usePlayerStore();
    const {data: favorites, error, isLoading} = useSWR("favorites", () => tuneMateInstance.getFavorites());
    const {hoveredItemId, handleMouseEnter, handleMouseLeave} = useHover();

    const removeSongFromFavorites = async (e, songId) => {
        try {
            e.stopPropagation();
            await tuneMateInstance.ManageSongInFavorites(songId);
            mutate("favorites");
        } catch (error) {
            console.error("Error removing song from favorites:", error);
        }
    };

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;


    const renderAlbumDetails = () => (<div className="flex items-center">
        <div className="flex items-end pt-20 p-4">
            <img
                src={FavoritesLogo}
                alt={"Favorites"}
                className="rounded transform transition-transform duration-500 hover:scale-105 h-28 w-28"/>
            <div className="ml-8 flex items-start flex-col">
                <h1 className="text-7xl ubuntu-bold">Your Favorites</h1>
                <p className={"mt-4 ml-4"}>{favorites.length} Songs</p>
            </div>
        </div>
    </div>);

    const renderSongsList = () => (<div className="flex flex-col mt-4 w-[50vw] mb-5">
        {favorites.length > 0 ? <>
            {favorites?.map((song, index) => (<div
                key={song.id}
                className="flex flex-col m-1 p-3 cursor-pointer hover:bg-[#18181b] rounded-xl"
                onClick={() => playSong(song.id)}
                onMouseEnter={() => handleMouseEnter(song.id)}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-center">
                    <div className="mr-2">
                        <h3>{index + 1}</h3>
                    </div>
                    <div className="flex items-center flex-1 ml-2">
                        <img src={song.imageUrl} alt={song.name} className="h-9 w-9 rounded"/>
                        <div className={"flex flex-col ml-4"}>
                            <h1 className="nunito-sans-bold"> {truncateString(decodeHtmlEntities(song.name))}</h1>
                            <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">
                                {truncateString(decodeHtmlEntities(song.primaryArtists))}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div>
                            {hoveredItemId === song.id && (<IoMdRemoveCircle color={"#59c2ef"}
                                                                             size={20}
                                                                             onClick={(e) => removeSongFromFavorites(e, song.id)}
                            />)}
                        </div>
                        <div>
                            <p className={"ml-4"}>{formatTime(song.duration)}</p>
                        </div>
                    </div>
                </div>
            </div>))}</> : <div className={"flex items-center min-h-48 justify-center"}>
            <h1>No Favorite Songs added</h1>

        </div>}

    </div>);

    return (<Wrapper>
        {renderAlbumDetails()}
        {renderSongsList()}
    </Wrapper>);
};

export default Favorites;
