import Wrapper from "./Wrapper";
import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import { Link } from "react-router-dom";
import { decodeHtmlEntities, truncateString } from "@/utils/MusicUtils.js";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import usePlayerStore from "@/store/use-player.js";
import useHover from "@/hooks/useHover.js";
import AlbumSkeleton from '@/_components/skeletons/AlbumSkeleton.jsx';
import useAuthStore from "@/store/use-auth.js";

const Home = () => {

    const { playSong, loadPlaylist } = usePlayerStore();
    const { hoveredItemId, handleMouseEnter, handleMouseLeave } = useHover();
    const { isAuthenticated } = useAuthStore();

    const {
        data: recommended, error, isLoading
    } = useSWR('tunemate-recommend', () => tuneMateInstance.getTuneMateRecommended());

    const {
        data: songHistory, err, isLoading: RecentsLoading
    } = useSWR(isAuthenticated ? 'user-song-history' : null, () => tuneMateInstance.getUserSongHistory());

    const handlePlayWholeList = async (e, id) => {
        e.preventDefault()
        await loadPlaylist({
            id: id, type: "RECOMMENDED_PLAYLIST", index: 0
        });
    };

    if (error || err) return <div><h1>Error.....</h1></div>;

    return (<Wrapper>

        <div className={"mb-8 "}>
            <h1 className={"text-2xl ubuntu-bold"}>Tunemate Recommended</h1>
            <div className="flex flex-col">

                {isLoading ? <AlbumSkeleton count={8} /> : <div className="flex items-center flex-wrap">
                    {recommended?.map((playlist) => (<Link to={`/recommended/${playlist.id}`} key={playlist.id}
                        className="flex cursor-pointer flex-col m-2 hover:bg-[#18181b] p-3 rounded-xl w-52 h-64 justify-center"
                        onMouseEnter={() => handleMouseEnter(playlist.id)}
                        onMouseLeave={handleMouseLeave}>

                        <div className={"relative"}>
                            {playlist.image ? <img src={playlist.image} alt="" className="rounded-xl" /> :
                                <BiSolidPlaylist size={170} color={"#59c2ef"} className={"m-[2px] "} />}
                            {hoveredItemId === playlist.id && (<div
                                className="absolute bottom-0 right-1 mb-2 mr-2 h-12 w-12 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out transform opacity-100 scale-100 hover:scale-110 hover:shadow-lg"
                                onClick={(e) => handlePlayWholeList(e, playlist.id)}
                                style={{ opacity: hoveredItemId === playlist.id ? 1 : 0 }}
                            >
                                <FaPlay
                                    size={15}
                                    color={"black"}
                                    className={"relative left-[1px] top-[1px]"}
                                />
                            </div>)}
                        </div>

                        <div className="flex flex-col mt-1">
                            <h3 className="mt-1  nunito-sans-bold">{truncateString(decodeHtmlEntities(playlist.name), 15)}</h3>
                            <div>
                                <p className={"text-[11px] text-[#6a6a6a] nunito-sans-bold"}>{playlist.songs.length} songs</p>
                            </div>
                        </div>
                    </Link>))}
                </div>}
            </div>
        </div>

        {isAuthenticated &&
            <>
                {RecentsLoading ? <AlbumSkeleton count={4} /> : <>
                    {songHistory?.length > 0 && (<div className="mb-8">

                        <div className={"flex items-center justify-between"}>
                            <h1 className="text-2xl ubuntu-bold">Recently Played</h1>
                            <Link to={'/recent'}>
                                <h1 className={"hover:underline nunito-sans-bold text-sm underline underline-offset-2"}>Show all</h1>
                            </Link>
                        </div>


                        <div className="flex flex-col h-[280px]">
                            <div className="flex flex-wrap overflow-y-hidden ">
                                {songHistory?.map((song) => (<div
                                    key={song.id}
                                    className="flex cursor-pointer flex-col m-2 hover:bg-[#18181b] p-3 rounded-xl w-52 h-64 justify-center"
                                    onMouseEnter={() => handleMouseEnter(song.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="relative h-44 w-44">
                                        <img
                                            src={song.image}
                                            alt=""
                                            className="rounded-xl h-44 w-44"
                                        />
                                        {hoveredItemId === song.id && (<div
                                            className="absolute bottom-0 right-1 mb-2 mr-2 h-12 w-12 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out transform opacity-100 scale-100 hover:scale-110 hover:shadow-lg"
                                            onClick={() => playSong(song.id)}
                                            style={{ opacity: hoveredItemId === song.id ? 1 : 0 }}
                                        >
                                            <FaPlay
                                                size={15}
                                                color={"black"}
                                                className={"relative left-[1px] top-[1px]"}
                                            />
                                        </div>)}
                                    </div>

                                    <div className="flex flex-col mt-1">
                                        <h3 className="mt-1 nunito-sans-bold">
                                            {truncateString(decodeHtmlEntities(song.name), 15)}
                                        </h3>
                                        <div className="flex items-center text-xs">
                                            <p className="text-[11px] text-[#6a6a6a] nunito-sans-bold">
                                                {truncateString(decodeHtmlEntities(song.album), 25)}
                                            </p>
                                        </div>
                                    </div>
                                </div>))}
                            </div>
                        </div>
                    </div>)}
                </>}
            </>
        }
    </Wrapper>)
}

export default Home