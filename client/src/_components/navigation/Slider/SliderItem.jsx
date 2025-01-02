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
      className="flex cursor-pointer flex-col rounded-xl justify-center  items-start transform transition-transform duration-300  md:hover:scale-110  md:hover:bg-[#303033] m-2 md:m-0 md:pt-4 md:pb-4 md:pl-3 md:pr-3"
      onMouseEnter={() => handleMouseEnter(playlist.id)}
      onMouseLeave={handleMouseLeave}
    >
      <PlaylistTile
        playlist={playlist}
        hoveredItemId={hoveredItemId}
        handlePlayWholeList={handlePlayWholeList}
      />

      <div className="flex flex-col mt-1 ">
        <h3 className="mt-1 text-md nunito-sans-bold">
          {truncateString(decodeHtmlEntities(playlist.name), 15)}
        </h3>
      </div>
    </Link>
  );
};

export default SliderItem;
