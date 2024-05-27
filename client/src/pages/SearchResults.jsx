import useSearchStore from "@/store/use-search.js";
import {useDebounce} from '@/hooks/useDebounce.js';
import MusicServiceInstance from '@/service/api/music_apis.js';
import useSWR from "swr";
import usePlayerStore from '@/store/use-player.js';

const SearchResults = () => {
    const {search} = useSearchStore();
    const {playSong} = usePlayerStore();
    const debouncedSearch = useDebounce(search, 300);
    const {
        data, error, isLoading
    } = useSWR(debouncedSearch ? ['search', debouncedSearch] : null, () => MusicServiceInstance.getSearchResults(debouncedSearch));

    if (isLoading) return <div>
        <h1>Loading.....</h1>
    </div>

    if (error) return <div>
        <h1>Error.....</h1>
    </div>

    return (<div className={"flex flex-col mb-32 ml-52"}>

        {/*top results and songs*/}
        <div className={"flex"}>
            <div>
                {data?.topQuery?.results.length > 0 && <div className={"flex m-2 flex-col"}>
                    <h1 className={"mukta-medium text-2xl"}>Top Result</h1>
                    <div key={data?.topQuery?.results[0]?.id} className={"flex m-2"}>
                        <div className={"flex items-center w-96 hover:bg-[#18181b] p-4 rounded-xl cursor-pointer"}>
                            <img src={data?.topQuery?.results[0]?.image[1]?.url} alt=""
                                 className={"h-36 w-36 rounded-xl"}/>
                            <div className={"flex flex-col ml-5"}>
                                <h1 className={"text-2xl mukta-medium "}>{data?.topQuery?.results[0]?.title}</h1>
                                <p className={"text-sm montserrat-font mt-1"}>{data?.topQuery?.results[0]?.singers}</p>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>

            <div className={"flex justify-center p-2 flex-col"}>
                <h1 className={"mukta-medium text-2xl"}>Songs</h1>
                {data?.songs?.results?.map((song) => {
                    return <div key={song.id} className={"flex m-2"}>
                        <div className={"flex items-center w-[30rem] hover:bg-[#18181b] cursor-pointer p-3 rounded-xl"}
                             onClick={() => playSong(song.id)}>
                            <img src={song.image[1].url} alt="" className={"h-12 w-12 rounded-xl"}/>
                            <div className={"flex flex-col ml-2"}>
                                <h3 className={"nunito-sans-bold"}>{song.title}</h3>
                                <p style={{
                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                }} className={"text-sm text-[#6a6a6a] nunito-sans-bold"}>{song.singers}</p>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>

        {/*albums*/}
        {data?.albums?.results.length > 0 && <div className={"flex flex-col"}>
            <h1 className={"mukta-medium text-2xl"}>Albums</h1>
            <div className={"flex items-center"}>
                {data?.albums?.results?.map((album) => {
                    return <div key={album.id}
                                className={"flex cursor-pointer flex-col m-2 hover:bg-[#18181b]  p-3 rounded-xl w-52 h-64 justify-center"}>

                        <img src={album.image[1].url} alt="" className={"rounded-xl"}/>

                        <div style={{width: "calc(100% - 1rem)"}} className={"flex flex-col mt-1"}>
                            <h3 className={"mt-1 mb-1 nunito-sans-bold"} style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }} dangerouslySetInnerHTML={{__html: album.title}}></h3>
                            <p style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }} className={"text-xs text-[#6a6a6a] nunito-sans-bold"}><span
                                className={"mr-1"}>{album.year} •</span>{album.artist}</p>
                        </div>
                    </div>

                })}
            </div>
        </div>}

        {/*artists*/}
        {data?.artists?.results.length > 0 && <div className={"flex flex-col"}>
            <h1 className={"mukta-medium text-2xl"}>Artists</h1>

            <div className={"flex items-center"}>
                {data?.artists?.results?.map((artist) => {
                    return <div key={artist.id}
                                className={"flex cursor-pointer flex-col m-2 hover:bg-[#18181b]  p-3 rounded-xl w-52 h-64 justify-center"}>

                        <img src={artist.image[1].url} alt="" className={"rounded-xl"}/>

                        <div style={{width: "calc(100% - 1rem)"}} className={"flex flex-col mt-1"}>
                            <h3 className={"mt-1 mb-1 nunito-sans-bold"} style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }} dangerouslySetInnerHTML={{__html: artist.title}}></h3>

                            <p className={"text-xs text-[#6a6a6a] nunito-sans-bold"}>{artist.description}</p>
                        </div>
                    </div>

                })}
            </div>
        </div>}

        {/*playlists*/}
        {data?.playlists?.results.length > 0 && <div className={"flex flex-col"}>
            <h1 className={"mukta-medium text-2xl"}>Playlists</h1>

            <div className={"flex items-center"}>
                {data?.playlists?.results?.map((playlist) => {
                    return <div key={playlist.id}
                                className={"flex cursor-pointer flex-col m-2 hover:bg-[#18181b]  p-3 rounded-xl w-52 h-64 justify-center"}>

                        <img src={playlist.image[1].url} alt="" className={"rounded-xl"}/>

                        <div style={{width: "calc(100% - 1rem)"}} className={"flex flex-col mt-1"}>
                            <h3 className={"mt-1 mb-1 nunito-sans-bold"} style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }} dangerouslySetInnerHTML={{__html: playlist.title}}></h3>

                            <p style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }} className={"text-xs"}><span
                                className={"mr-1"}>{playlist.language} •</span>{playlist.description}</p>

                        </div>
                    </div>

                })}
            </div>
        </div>}

    </div>);
};

export default SearchResults;