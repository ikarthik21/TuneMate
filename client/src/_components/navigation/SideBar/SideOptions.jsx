import {Link} from 'react-router-dom';
import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import useAuthStore from "@/store/use-auth.js";
import {BiSolidPlaylist} from "react-icons/bi";
import {IoLibrary} from "react-icons/io5";
import FavImg from '@/assets/images/favorites.png';
import {useSidebar} from "@/store/use-sidebar.js";
import usePlayerStore from "@/store/use-player.js";
import SideListSkeleton from "@/_components/skeletons/SideListSkeleton.jsx";

const SideOptions = () => {
    const {isAuthenticated} = useAuthStore();
    const {collapse} = useSidebar((state) => state);
    const {Favorites} = usePlayerStore()
    const {
        data: playlists, error, isLoading,
    } = useSWR(isAuthenticated ? "user-playlists" : null, () => tuneMateInstance.getPlaylists());


    if (error) return <div><h1>Error.....</h1></div>;

    return (<div className={"mt-4"}>
        <div className={"flex flex-col"}>


            <div className={"flex flex-col mt-4"}>

                <div
                    className={"flex items-center cursor-pointer   px-2 py-2  rounded overflow-hidden"}>
                    <div>
                        <IoLibrary size={35} color={"#59c2ef"} className={"m-[2px] "}/>
                    </div>
                    <div>
                        <h1 className={"nunito-sans-bold overflow-hidden ml-4"}>Your Playlists</h1>
                    </div>
                </div>


                {isLoading ? <SideListSkeleton count={5}/> :

                    <>
                        <Link to={"/favorites"}>
                            <div
                                className={"flex items-center cursor-pointer hover:bg-[#222328] px-2 py-2  rounded overflow-hidden"}>
                                <img src={FavImg} alt="" className={"h-10 w-10 rounded"}/>

                                {!collapse && <div className={"flex flex-col justify-center ml-3"}>
                                    <h1 className={" text-sm nunito-sans-bold"}>Favorites</h1>
                                    <p className={"text-xs text-[#6a6a6a] nunito-sans-bold"}>{Favorites.length} songs</p>
                                </div>}

                            </div>
                        </Link>
                        <div className={"flex flex-col mt-1"}>
                            {playlists?.map(playlist => {
                                return (<Link to={`/u/playlists/${playlist.id}`} key={playlist.id}>
                                    <div
                                        className={"flex items-center cursor-pointer hover:bg-[#222328] px-2 py-2  rounded overflow-hidden  mt-1 mb-1"}>
                                        {playlist.image ?
                                            <img src={playlist.image} alt="" className={"h-11 w-11 rounded"}/> :
                                            <BiSolidPlaylist size={35} color={"#59c2ef"} className={"m-[2px] "}/>}

                                        {!collapse && <div className={"flex flex-col justify-center ml-3"}>
                                            <h1 className={"text-sm nunito-sans-bold"}>{playlist.name}</h1>
                                            <p className={"text-xs text-[#6a6a6a] nunito-sans-bold"}>{playlist.songs.length} songs</p>
                                        </div>}

                                    </div>
                                </Link>)
                            })}
                        </div>
                    </>


                }


            </div>


        </div>
    </div>);
};

export default SideOptions;