/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { BiSolidPlaylist } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PlayListItem = ({ playlist, collapse }) => {
  return (
    <Link to={`/u/playlists/${playlist.id}`} key={playlist.id}>
      <div
        className={`flex items-center ${
          collapse ? "justify-center " : ""
        } cursor-pointer hover:bg-[#222328] rounded overflow-hidden p-2 mt-1 mb-1`}
      >
        {playlist.image ? (
          <LazyLoadImage
            alt=""
            effect="blur"
            wrapperProps={{
              style: { transitionDelay: "0.5s" }
            }}
            loading="lazy"
            className={"h-11 w-11 rounded"}
            src={playlist.image}
          />
        ) : (
          <BiSolidPlaylist size={35} color={"#59c2ef"} className={"m-[2px] "} />
        )}

        {!collapse && (
          <div className={"flex flex-col justify-center ml-3"}>
            <h1 className={"text-sm nunito-sans-bold"}>{playlist.name}</h1>
            <p className={"text-xs text-[#6a6a6a] mt-1 nunito-sans-bold"}>
              {playlist.songs.length} songs
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlayListItem;
