import {decodeHtmlEntities, getAllArtists, truncateString} from "@/utils/MusicUtils.js";
import {MdFavorite} from "react-icons/md";
import {IoMdAddCircle} from "react-icons/io";
import useAuthStore from "@/store/use-auth.js";
import usePlayerStore from "@/store/use-player.js";
import AddToPlaylist from "@/_components/Options/AddToPlaylist.jsx";
import useAddListStore from "@/store/use-addList.js";

// eslint-disable-next-line react/prop-types
const MusicInfo = ({song}) => {
    const {isAuthenticated} = useAuthStore();
    const {Favorites} = usePlayerStore();
    const {isAddToPlaylistVisible, showAddToPlaylist} = useAddListStore();


    return (<>
        {!!song && (<div className="flex items-center ">

            <div>
                <img src={song?.image[1].url} alt={`song img`} className="h-14 w-14 rounded-md"/>
            </div>

            <div className="flex flex-col ml-4 justify-center">
                <h3 className="mt-1 mb-1 nunito-sans-bold">{truncateString(decodeHtmlEntities(song?.name), 25)}</h3>
                <div className="flex items-center">
                    <p className="text-xs mr-1">{truncateString(decodeHtmlEntities(getAllArtists(song)))}</p>
                </div>
            </div>

            <div className="ml-4 mb-6">
                {isAuthenticated && <div className={"absolute "}>
                    {Favorites.includes(song.id) ?

                        <MdFavorite size={22} cursor={"pointer"} color={"#59c2ef"} onClick={() => {
                            showAddToPlaylist(song.id)
                        }}/> : <IoMdAddCircle size={22} cursor={"pointer"} color={"#59c2ef"}
                                              onClick={() => showAddToPlaylist(song.id)}/>}

                    {isAddToPlaylistVisible  && <AddToPlaylist/>}
                </div>}
            </div>
        </div>)}
    </>);
};

export default MusicInfo;
