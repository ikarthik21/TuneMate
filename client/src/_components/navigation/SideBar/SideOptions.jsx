import { Link } from "react-router-dom";
import useSWR from "swr";
import tuneMateInstance from "@/service/api/api.js";
import useAuthStore from "@/store/use-auth.js";
import SideListSkeleton from "@/_components/skeletons/SideListSkeleton.jsx";
import { FaHistory } from "react-icons/fa";
import ApiError from "@/_components/Error/ApiError";
import PlayListItem from "./PlayListItem";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import { IoMdHeart } from "react-icons/io";
import { useSidebar } from "@/store/use-sidebar";

const SideOptions = () => {
  const { collapse } = useSidebar((state) => state);
  const { isAuthenticated } = useAuthStore();

  const {
    data: playlists,
    error,
    isLoading
  } = useSWR(isAuthenticated ? "user-playlists" : null, () =>
    tuneMateInstance.getPlaylists()
  );

  if (error) return <ApiError />;

  return (
    <BlockWrapper rounded={"rounded-none rounded-b h-full"}>
      <div className="flex flex-col">
        <Link to={"/recent"}>
          <div
            className={`flex items-center ${
              collapse ? "justify-center" : ""
            } py-4 px-2 bg-[#1a1a1a] p-2 cursor-pointer  mb-1 hover:bg-[#222328]  `}
          >
            <FaHistory size={28} />
            {!collapse && (
              <h1 className="text-md nunito-sans-bold ml-4">Recents</h1>
            )}
          </div>
        </Link>

        <Link to={"/favorites"}>
          <div
            className={`flex items-center py-2 px-2 ${
              collapse ? "justify-center" : ""
            } bg-[#1a1a1a] cursor-pointer hover:bg-[#222328] rounded`}
          >
            <div className={"flex items-center"}>
              <IoMdHeart size={33} />
              {!collapse && (
                <div className="ml-3">
                  <h1 className={"text-sm nunito-sans-bold"}>Favorites</h1>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Scrollable Content */}
        <div
          className={
            "flex flex-col overflow-scroll h-[calc(100vh-300px)] custom-scrollbar"
          }
        >
          {isLoading ? (
            <SideListSkeleton count={5} />
          ) : (
            <>
              {playlists?.map((playlist) => {
                return PlayListItem({ playlist, collapse });
              })}
            </>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default SideOptions;
