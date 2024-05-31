import useSearchStore from "@/store/use-search.js";
import {useDebounce} from '@/hooks/useDebounce.js';
import MusicServiceInstance from '@/service/api/music_apis.js';
import useSWR from "swr";
import usePlayerStore from '@/store/use-player.js';
import {decodeHtmlEntities, truncateString} from '@/utils/MusicUtils.js';
import {Link} from 'react-router-dom';
import Wrapper from "@/pages/Wrapper.jsx";

const SearchResults = () => {
    const {search} = useSearchStore();
    const {playSong} = usePlayerStore();
    const debouncedSearch = useDebounce(search, 400);

    const {
        data, error, isLoading
    } = useSWR(debouncedSearch ? ['search', debouncedSearch] : null, () => MusicServiceInstance.getSearchResults(debouncedSearch));

    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    const renderTopResult = () => {
        const topResult = data?.topQuery?.results[0];
        if (!topResult) return null;

        const renderItem = (type, id, children) => {
            if (type === "song") {
                return (<div key={id} className="flex m-2" onClick={() => playSong(id)}>
                    {children}
                </div>);
            }

            return (<Link key={id} to={`/${type}s/${id}`} className="flex m-2" onClick={() => playSong(id)}>
                {children}
            </Link>);
        };

        return (<div className="flex m-2 flex-col">
            <h1 className="mukta-medium text-2xl">Top Result</h1>
            {renderItem(topResult.type, topResult.id, (
                <div className="flex items-center w-96 hover:bg-[#18181b] p-4 rounded-xl cursor-pointer">
                    <img src={topResult.image[1].url} alt="" className="h-36 w-36 rounded-xl"/>
                    <div className="flex flex-col ml-5">
                        <h1 className="text-2xl mukta-medium">{truncateString(decodeHtmlEntities(topResult.title), 20)}</h1>
                        {topResult.type === "song" && (
                            <p className="text-xs montserrat-font mt-1">{truncateString(decodeHtmlEntities(topResult.singers))}</p>)}
                    </div>
                </div>))}
        </div>);
    };

    const renderSongs = () => (data?.songs?.results.length > 0 && (<div className="flex justify-center p-2 flex-col">
        <h1 className="mukta-medium text-2xl">Songs</h1>
        {data.songs.results.map(song => (<div key={song.id} className="flex m-2">
            <div
                className="flex items-center w-[25rem] hover:bg-[#18181b] cursor-pointer p-3 rounded-xl"
                onClick={() => playSong(song.id)}
            >
                <img src={song.image[1].url} alt="" className="h-12 w-12 rounded-xl"/>
                <div className="flex flex-col ml-2">
                    <h3 className="nunito-sans-bold">{truncateString(decodeHtmlEntities(song.title), 35)}</h3>
                    <p className="text-xs text-[#6a6a6a] nunito-sans-bold">{truncateString(decodeHtmlEntities(song.singers))}</p>
                </div>
            </div>
        </div>))}
    </div>));

    const renderAlbums = () => (data?.albums?.results.length > 0 && (<div className="flex flex-col">
        <h1 className="mukta-medium text-2xl">Albums</h1>
        <div className="flex items-center">
            {data.albums.results.map(album => (<Link key={album.id} to={`/albums/${album.id}`}
                                                     className="flex cursor-pointer flex-col m-2 hover:bg-[#18181b] p-3 rounded-xl w-52 h-64 justify-center">
                <img src={album.image[1].url} alt="" className="rounded-xl"/>
                <div className="flex flex-col mt-1">
                    <h3 className="mt-1 mb-1 nunito-sans-bold">{truncateString(decodeHtmlEntities(album.title), 15)}</h3>
                    <p className="text-xs text-[#6a6a6a] nunito-sans-bold">
                        <span className="mr-1">{album.year} •</span>
                        {truncateString(decodeHtmlEntities(album.artist), 15)}
                    </p>
                </div>
            </Link>))}
        </div>
    </div>));

    const renderArtists = () => (data?.artists?.results.length > 0 && (<div className="flex flex-col">
        <h1 className="mukta-medium text-2xl">Artists</h1>
        <div className="flex items-center">
            {data.artists.results.map(artist => (<Link key={artist.id} to={`/artists/${artist.id}`}
                                                       className="flex cursor-pointer flex-col m-2 hover:bg-[#18181b] p-3 rounded-xl w-52 h-64 justify-center">
                <img src={artist.image[1].url} alt="" className="rounded-xl"/>
                <div className="flex flex-col mt-1">
                    <h3 className="mt-1 mb-1 nunito-sans-bold">{truncateString(decodeHtmlEntities(artist.title), 20)}</h3>
                    <p className="text-xs text-[#6a6a6a] nunito-sans-bold">{truncateString(decodeHtmlEntities(artist.description))}</p>
                </div>
            </Link>))}
        </div>
    </div>));

    const renderPlaylists = () => (data?.playlists?.results.length > 0 && (<div className="flex flex-col">
        <h1 className="mukta-medium text-2xl">Playlists</h1>
        <div className="flex items-center">
            {data.playlists.results.map(playlist => (<Link key={playlist.id} to={`/playlists/${playlist.id}`}
                                                           className="flex cursor-pointer flex-col m-2 hover:bg-[#18181b] p-3 rounded-xl w-52 h-64 justify-center">
                <img src={playlist.image[1].url} alt="" className="rounded-xl"/>
                <div className="flex flex-col mt-1">
                    <h3 className="mt-1 mb-1 nunito-sans-bold">{truncateString(decodeHtmlEntities(playlist.title), 20)}</h3>
                    <p className="text-xs">
                                    <span
                                        className="mr-1">{truncateString(decodeHtmlEntities(playlist.language))} •</span>
                        {truncateString(decodeHtmlEntities(playlist.description))}
                    </p>
                </div>
            </Link>))}
        </div>
    </div>));

    return (<Wrapper>
        <div className="flex flex-col mb-32">
            <div className="flex">
                {renderTopResult()}
                {renderSongs()}
            </div>
            {renderAlbums()}
            {renderArtists()}
            {renderPlaylists()}
        </div>
    </Wrapper>);
};

export default SearchResults;
