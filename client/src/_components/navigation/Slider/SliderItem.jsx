/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import useHover from "@/hooks/useHover.js";
import usePlayerStore from "@/store/use-player.js";
import PlaylistTile from "@/_components/PlaylistComponents/PlaylistTile";
import { decodeHtmlEntities, truncateString } from "@/utils/MusicUtils.js";
const SliderItem = ({ playlist }) => {
  const { hoveredItemId, handleMouseEnter, handleMouseLeave } = useHover();
  const { loadPlaylist } = usePlayerStore();
  const handlePlayWholeList = async (e, id) => {
    e.preventDefault();
    await loadPlaylist({
      id: id,
      type: "RECOMMENDED_PLAYLIST",
      index: 0
    });
  };

  return (
    <Link
      to={`/recommended/${playlist.id}`}
      key={playlist.id}
      className="flex cursor-pointer flex-col m-2 p-1 rounded-xl justify-center items-start transform transition-transform duration-300  hover:scale-110 "
      onMouseEnter={() => handleMouseEnter(playlist.id)}
      onMouseLeave={handleMouseLeave}
    >
      <PlaylistTile
        playlist={playlist}
        hoveredItemId={hoveredItemId}
        handlePlayWholeList={handlePlayWholeList}
      />

      <div className="flex flex-col mt-1 ">
        <h3 className="mt-1 text-sm nunito-sans-bold">
          {truncateString(decodeHtmlEntities(playlist.name), 15)}
        </h3>
        <div className="flex items-center text-xs">
          <p className="text-[11px] text-[#6a6a6a] nunito-sans-bold">
            {truncateString(decodeHtmlEntities(playlist.album), 15)}
          </p>
        </div>
        <div>
          <p className={"text-[11px] text-[#6a6a6a] nunito-sans-bold"}>
            {/* {playlist.songs.length} songs */}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SliderItem;
