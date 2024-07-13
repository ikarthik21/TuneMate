import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import useHover from "@/hooks/useHover.js";
import usePlayerStore from "@/store/use-player.js";
import Wrapper from "@/pages/Wrapper.jsx";
import {decodeHtmlEntities, truncateString} from "@/utils/MusicUtils.js";
import {FaPlay} from "react-icons/fa";

const UserRecents = () => {
    const {hoveredItemId, handleMouseEnter, handleMouseLeave} = useHover();
    const {playSong} = usePlayerStore();
    const {
        data: songHistory, error, isLoading
    } = useSWR('user-recents', () => tuneMateInstance.getUserSongHistory());

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    return (<Wrapper>
        {songHistory.length > 0 && (<div className="mb-8">

            <div className={"flex items-center justify-between"}>
                <h1 className="text-2xl ubuntu-bold">Recently Played</h1>

            </div>


            <div className="flex flex-col">
                <div className="flex flex-wrap ">
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
                                style={{opacity: hoveredItemId === song.id ? 1 : 0}}
                            >
                                <FaPlay
                                    size={15}
                                    color={"black"}
                                    className={"relative left-[1px] top-[1px]"}
                                />
                            </div>)}
                        </div>

                        <div className="flex flex-col mt-1">
                            <h3 className="mt-1 mb-1 nunito-sans-bold">
                                {truncateString(decodeHtmlEntities(song.name), 15)}
                            </h3>
                            <div className="flex items-center text-xs">
                                <p className="mr-2 text-xs text-[#6a6a6a] nunito-sans-bold">
                                    {truncateString(decodeHtmlEntities(song.album), 25)}
                                </p>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>)}

    </Wrapper>);
};

export default UserRecents;