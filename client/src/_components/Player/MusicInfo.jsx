import {decodeHtmlEntities, getAllArtists, truncateString} from "@/utils/MusicUtils.js";
import {MdFavorite} from "react-icons/md";
import tuneMateInstance from '@/service/api/api.js';
import Toast from "@/utils/Toast.js";
import useSWR, {mutate} from "swr";
import {IoMdAddCircle} from "react-icons/io";
import useAuthStore from "@/store/use-auth.js";


// eslint-disable-next-line react/prop-types
const MusicInfo = ({song}) => {
    const {isAuthenticated} = useAuthStore();
    const {
        data, error
    } = useSWR(song?.id && isAuthenticated ? `checkinfavorites-${song.id}` : null, () => tuneMateInstance.checkSonginFavorites(song.id));


    const handleFavorite = async (song_id) => {
        try {
            const response = await tuneMateInstance.ManageSongInFavorites(song_id);
            Toast({type: response.type, message: response.message, duration: 400});
            mutate("favorites");
            mutate(`checkinfavorites-${song.id}`);
        } catch (err) {
            console.log(`Error managing favorite status for song_id: }`, err);
            mutate(`checkinfavorites-${song.id}`);
        }
    };

    if (error) {
        console.error("Error fetching favorite status:", error);
    }

    return (<>
        {song && (<div className="flex items-center">
            <div>
                <img src={song?.image[1].url} alt={`song img`} className="h-14 w-14 rounded-xl"/>
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
                        {data?.isFavorite ?
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
