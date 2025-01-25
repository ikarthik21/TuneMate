/* eslint-disable react/prop-types */
import { BiSolidPlaylist } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PlaylistTile = ({ playlist, hoveredItemId, handlePlayWholeList }) => {
  return (
    <div className={"relative"}>
      {playlist.image ? (
        <LazyLoadImage
          alt=""
          effect="blur"
          wrapperProps={{
            style: { transitionDelay: "0.5s" }
          }}
          loading="lazy"
          className="rounded-md h-32 w-32 md:h-44 md:w-44"
          src={playlist.image}
        />
      ) : (
        <BiSolidPlaylist size={170} color={"#59c2ef"} className={"m-[2px]"} />
      )}
      {hoveredItemId === playlist.id && (
        <div
          className="absolute bottom-0 right-1 mb-2 mr-2 h-12 w-12 rounded-full bg-[#59c2ef] flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out transform opacity-100 scale-100 hover:scale-110 hover:shadow-lg"
          onClick={(e) => handlePlayWholeList(e, playlist.id)}
          style={{
            opacity: hoveredItemId === playlist.id ? 1 : 0
          }}
        >
          <FaPlay
            size={15}
            color={"black"}
            className={"relative left-[1px] top-[1px]"}
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistTile;
