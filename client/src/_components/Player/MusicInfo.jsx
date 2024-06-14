import {decodeHtmlEntities, getAllArtists, truncateString} from "@/utils/MusicUtils.js";
import {MdFavorite} from "react-icons/md";
import tuneMateInstance from '@/service/api/api.js';
import Toast from "@/utils/Toast.js";
import {IoMdAddCircle} from "react-icons/io";
import useAuthStore from "@/store/use-auth.js";
import usePlayerStore from "@/store/use-player.js";


// eslint-disable-next-line react/prop-types
const MusicInfo = ({song}) => {
    const {isAuthenticated} = useAuthStore();
    const {Favorites, getFavorites} = usePlayerStore();

    const handleFavorite = async (song_id) => {
        try {
            const response = await tuneMateInstance.ManageSongInFavorites(song_id);
            Toast({type: response.type, message: response.message, duration: 400});
            await getFavorites();
        } catch (err) {
            console.log(`Error managing favorite status for song_id: }`, err);
        }
    };

    return (<>
        {!!song && (<div className="flex items-center">
            <div>
                <img src={song?.image[1].url} alt={`song img`} className="h-14 w-14 rounded-md"/>
            </div>
            <div className="flex flex-col ml-4 justify-center">
                <h3 className="mt-1 mb-1 nunito-sans-bold">{truncateString(decodeHtmlEntities(song?.name), 25)}</h3>
                <div className="flex items-center">
                    <p className="text-xs mr-1">{truncateString(decodeHtmlEntities(getAllArtists(song)))}</p>
                </div>
            </div>
            <div className="ml-4">
                {
                    isAuthenticated && <>
                        {Favorites.includes(song.id) ?
                            <MdFavorite size={22} cursor={"pointer"} color={"#59c2ef"}
                                        onClick={() => handleFavorite(song.id)}
                            /> : <IoMdAddCircle size={22} cursor={"pointer"} color={"#59c2ef"}
                                                onClick={() => handleFavorite(song.id)}/>}
                    </>
                }
            </div>
        </div>)}
    </>);
};

export default MusicInfo;
