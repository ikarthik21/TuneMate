import Wrapper from "./Wrapper";
import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import {Link} from "react-router-dom";
import {decodeHtmlEntities, truncateString} from "@/utils/MusicUtils.js";


const Home = () => {

    const {
        data: recommended, error, isLoading
    } = useSWR('tunemate-recommend', () => tuneMateInstance.getTuneMateRecommended());
    
    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    return (<Wrapper>

        <div>
            <h1 className={"text-2xl ubuntu-bold"}>Tunemate Recommended</h1>
            <div className="flex flex-col">
                <div className="flex items-center">
                    {recommended?.playlists?.map((playlist) => (
                        <Link to={`/u/playlists/${playlist.id}`} key={playlist.id}
                              className="flex cursor-pointer flex-col m-2 hover:bg-[#18181b] p-3 rounded-xl w-52 h-64 justify-center">
                            <img src={playlist.image} alt="" className="rounded-xl"/>
                            <div className="flex flex-col mt-1">
                                <h3 className="mt-1 mb-1 nunito-sans-bold">{truncateString(decodeHtmlEntities(playlist.name), 20)}</h3>
                                <p>
                                    <p className={"text-xs text-[#6a6a6a] nunito-sans-bold"}>{playlist.songs.length} songs</p>
                                </p>
                            </div>
                        </Link>))}
                </div>
            </div>
        </div>


    </Wrapper>)
}

export default Home