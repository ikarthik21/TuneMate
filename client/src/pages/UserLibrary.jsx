import Wrapper from "./Wrapper";
import BlockWrapper from "@/_components/Wrappers/BlockWrapper";
import ApiError from "@/_components/Error/ApiError";
import tuneMateInstance from "@/service/api/api";
import useSWR from "swr";
import useAuthStore from "@/store/use-auth";
import SideListSkeleton from "@/_components/skeletons/SideListSkeleton";
import { Link } from "react-router-dom";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaHistory } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";

const UserLibrary = () => {
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
    <Wrapper>
      <BlockWrapper margin={"mb-6"}>
        {isLoading ? (
          <SideListSkeleton count={5} />
        ) : (
          <>
            <div className="flex flex-col p-3 pt-8">
              <h1 className="text-2xl md:text-3xl jaro-head">Your Library</h1>

              <div className="flex flex-col justify-center mt-4">
                <Link to="/recents">
                  <div className="flex items-center  py-4 px-4 w-full rounded bg-[#1f1f1f]">
                    <FaHistory size={27} />
                    <h1 className="ml-5 text-sm nunito-sans-bold">Recents</h1>
                  </div>
                </Link>
                <Link to="/favorites">
                  <div className="flex items-center mt-2 mb-1 py-4 px-4 w-full rounded bg-[#1f1f1f]">
                    <IoMdHeart size={27} />
                    <h1 className="ml-5 text-sm nunito-sans-bold">Favorites</h1>
                  </div>
                </Link>

                {playlists?.map((playlist) => {
                  return (
                    <Link to={`/u/playlists/${playlist.id}`} key={playlist.id}>
                      <div
                        className={`flex items-center 
                     cursor-pointer hover:bg-[#222328] rounded overflow-hidden p-2 mt-1 mb-1 bg-[#1f1f1f]`}
                      >
                        {playlist.image ? (
                          <img
                            src={playlist.image}
                            alt=""
                            className={"h-11 w-11 rounded"}
                          />
                        ) : (
                          <BiSolidPlaylist
                            size={35}
                            color={"#59c2ef"}
                            className={"m-[2px] "}
                          />
                        )}

                        <div className={"flex flex-col justify-center ml-3"}>
                          <h1 className={"text-sm nunito-sans-bold"}>
                            {playlist.name}
                          </h1>
                          <p
                            className={
                              "text-xs text-[#6a6a6a] mt-1 nunito-sans-bold"
                            }
                          >
                            {playlist.songs.length} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </BlockWrapper>
    </Wrapper>
  );
};

export default UserLibrary;
