import useSearchStore from "@/store/use-search.js";
import { useDebounce } from "@/hooks/useDebounce.js";
import MusicServiceInstance from "@/service/api/music_apis.js";
import useSWR from "swr";
import usePlayerStore from "@/store/use-player.js";
import { decodeHtmlEntities, truncateString } from "@/utils/MusicUtils.js";
import { Link } from "react-router-dom";
import Wrapper from "@/pages/Wrapper.jsx";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { IoClose } from "react-icons/io5";

const MobileSearch = () => {
  const { playSong } = usePlayerStore();
  const { search, setSearch } = useSearchStore();
  const debouncedSearch = useDebounce(search, 400);

  const { data, error, isLoading } = useSWR(
    debouncedSearch ? ["search", debouncedSearch] : null,
    () => MusicServiceInstance.getSearchResults(debouncedSearch)
  );

  if (isLoading)
    return (
      <div>
        <h1>Loading.....</h1>
      </div>
    );
  if (error)
    return (
      <div>
        <h1>Error.....</h1>
      </div>
    );

  const renderTopResult = () => {
    const topResult = data?.topQuery?.results[0];
    if (!topResult) return null;
    const renderItem = (type, id, children) => {
      if (type === "song") {
        return (
          <div key={id} className="flex m-2" onClick={() => playSong(id)}>
            {children}
          </div>
        );
      }

      return (
        <Link key={id} to={`/${type}s/${id}`} className="flex m-2">
          {children}
        </Link>
      );
    };

    return (
      <div className="flex m-2 flex-col">
        <h1 className="text-2xl jaro-head mt-2">Top Result</h1>
        {renderItem(
          topResult.type,
          topResult.id,
          <div className="flex items-center w-96 hover:bg-[#303033] p-4 rounded-xl cursor-pointer">
            <img
              src={topResult.image[1].url}
              alt=""
              className="h-32 w-32 rounded-xl"
            />
            <div className="flex flex-col ml-5">
              <h1 className="text-xl mukta-medium">
                {truncateString(decodeHtmlEntities(topResult.title), 20)}
              </h1>
              {topResult.type === "song" && (
                <p className="text-xs text-[#6a6a6a] montserrat-font mt-1">
                  {truncateString(decodeHtmlEntities(topResult.singers), 20)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSongs = () =>
    data?.songs?.results.length > 0 && (
      <div className="flex justify-center  flex-col">
        <h1 className="text-2xl jaro-head mt-2 ml-2">Songs</h1>
        {data.songs.results.map((song) => (
          <div key={song.id} className="flex m-2">
            <div
              className="flex items-center w-[25rem] hover:bg-[#303033] cursor-pointer p-3 rounded-xl"
              onClick={() => playSong(song.id)}
            >
              <img
                src={song.image[1].url}
                alt=""
                className="h-14 w-14 rounded-xl"
              />
              <div className="flex flex-col ml-4">
                <h3 className="nunito-sans-bold ">
                  {truncateString(decodeHtmlEntities(song.title), 35)}
                </h3>
                <p className="text-xs text-[#6a6a6a] nunito-sans-bold">
                  {truncateString(decodeHtmlEntities(song.singers), 35)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  const renderAlbums = () =>
    data?.albums?.results.length > 0 && (
      <div className="flex flex-col">
        <h1 className="text-2xl jaro-head ml-2">Albums</h1>
        <div className="flex flex-col p-2">
          {data.albums.results.map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.id}`}
              className="flex cursor-pointer items-center hover:bg-[#303033] p-3 rounded-xl "
            >
              <img
                src={album.image[1].url}
                alt=""
                className="rounded-xl h-14 w-14"
              />
              <div className="flex flex-col mt-1 ml-4">
                <h3 className="mt-1 mb-1 nunito-sans-bold">
                  {truncateString(decodeHtmlEntities(album.title), 25)}
                </h3>
                <p className="text-xs text-[#6a6a6a] nunito-sans-bold">
                  <span className="mr-1">{album.year} •</span>
                  {truncateString(decodeHtmlEntities(album.artist), 25)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );

  const renderArtists = () =>
    data?.artists?.results.length > 0 && (
      <div className="flex flex-col">
        <h1 className="text-2xl jaro-head ml-2">Artists</h1>
        <div className="flex p-2 flex-col ">
          {data.artists.results.map((artist) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="flex cursor-pointer hover:bg-[#303033] p-3 rounded-xl "
            >
              <img src={artist.image[1].url} alt="" className="rounded-xl h-14 w-14" />
              <div className="flex flex-col mt-1 ml-4 ">
                <h3 className="mt-1 mb-1 nunito-sans-bold">
                  {truncateString(decodeHtmlEntities(artist.title), 20)}
                </h3>
                <p className="text-xs text-[#6a6a6a] nunito-sans-bold">
                  {truncateString(decodeHtmlEntities(artist.description))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );

  const renderPlaylists = () =>
    data?.playlists?.results.length > 0 && (
      <div className="flex flex-col">
        <h1 className="text-2xl jaro-head ml-2">Playlists</h1>
        <div className="flex flex-col p-2">
          {data.playlists.results.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlists/${playlist.id}`}
              className="flex cursor-pointer hover:bg-[#303033] p-3 rounded-xl "
            >
              <img src={playlist.image[1].url} alt="" className="rounded-xl h-14 w-14" />
              <div className="flex flex-col mt-1 ml-4">
                <h3 className="mt-1 mb-1 nunito-sans-bold">
                  {truncateString(decodeHtmlEntities(playlist.title), 20)}
                </h3>
                <p className="text-xs text-[#6a6a6a]">
                  <span className="mr-1">
                    {truncateString(decodeHtmlEntities(playlist.language))} •
                  </span>
                  {truncateString(decodeHtmlEntities(playlist.description))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );

  return (
    <Wrapper>
      <div className="sticky top-20 left-0">
        <div className="flex items-center flex-1 justify-center bg-[#1e1e1e] border-[#adadad] border rounded-lg relative m-3 ">
          <div className="p-3">
            <FiSearch size={20} />
          </div>
          <Input
            className="rounded-full bg-[#1e1e1e]  h-[38px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
            placeholder="Search for a Song, Album, or Artist...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <div
              className="absolute right-4 p-3 transform hover:scale-110 cursor-pointer"
              onClick={() => setSearch("")}
            >
              <IoClose size={20} />
            </div>
          )}
        </div>
      </div>

      <BlockWrapper>
        <div className="flex flex-col mb-20 mt-4 p-2">
          <div className="flex flex-col">
            {renderTopResult()}
            {renderSongs()}
          </div>
          {renderAlbums()}
          {renderArtists()}
          {renderPlaylists()}
        </div>
      </BlockWrapper>
    </Wrapper>
  );
};

export default MobileSearch;
