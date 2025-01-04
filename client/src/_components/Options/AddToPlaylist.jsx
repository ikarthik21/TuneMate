/* eslint-disable react/prop-types */
import { FiSearch } from "react-icons/fi";
import { IoMdAdd, IoMdAddCircle } from "react-icons/io";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAddToPlaylist from "@/hooks/useAddToPlayList.js";
import useAddListStore from "@/store/use-addList.js";
import FavImg from "@/assets/images/favorites.png";
import tuneMateInstance from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";
import { mutate } from "swr";
import usePlayerStore from "@/store/use-player.js";
import { useEffect, useRef, useState, useLayoutEffect } from "react";

const AddToPlaylist = ({ clickEvent }) => {
  const { Favorites, getFavorites } = usePlayerStore();
  const { hideAddToPlaylist, songId } = useAddListStore();
  const addMenuRef = useRef(null);
  const [position, setPosition] = useState("bottom-4");
  const [searchPlaylist, setSearchPlaylist] = useState("");

  const {
    playlists,
    error,
    isLoading,
    playlistName,
    setPlaylistName,
    showCreatePlaylist,
    handleToggleCreatePlaylist,
    selectedPlaylists,
    togglePlaylistSelection,
    handleCreatePlaylist,
    setShowCreatePlaylist,
    handleSaveChanges
  } = useAddToPlaylist();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        hideAddToPlaylist();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addMenuRef, hideAddToPlaylist]);

  useLayoutEffect(() => {
    const calculatePosition = () => {
      if (addMenuRef.current && clickEvent) {
        const rect = addMenuRef.current.getBoundingClientRect();
        const clickY = clickEvent.clientY;
        const spaceAbove = clickY;
        const spaceBelow = window.innerHeight - clickY;
        setPosition(
          spaceBelow < rect.height && spaceAbove > spaceBelow
            ? "bottom-2"
            : "top-2"
        );
      }
    };
    calculatePosition();
    window.addEventListener("resize", calculatePosition);
    return () => window.removeEventListener("resize", calculatePosition);
  }, [clickEvent]);

  const handleFavorite = async (song_id) => {
    try {
      const response = await tuneMateInstance.ManageSongInFavorites(song_id);
      Toast({ type: response.type, message: response.message, duration: 400 });
      await getFavorites();
      mutate("favorites");
    } catch (err) {
      console.error(
        `Error managing favorite status for song_id: ${song_id}`,
        err
      );
    }
  };

  if (isLoading)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  if (error)
    return (
      <div>
        <h1>Error...</h1>
      </div>
    );

  return (
    <motion.div
      ref={addMenuRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className={`rounded-lg w-full md:w-64 z-50 bg-[#18181b] border-[#2D2E35] p-4 absolute left-0 md:left-1 ${position}`}
    >
      <div className="flex flex-col">
        {/* Search Playlist */}
        <div className="flex items-center justify-center bg-[#222328] border-[#606064] rounded relative mt-1 mb-3">
          <div className="p-2">
            <FiSearch size={18} />
          </div>
          <Input
            className="rounded bg-[#222328] h-[35px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
            placeholder="Find a playlist"
            onChange={(e) => setSearchPlaylist(e.target.value)}
          />
        </div>

        {/* New Playlist Section */}
        <AnimatePresence>
          {showCreatePlaylist && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              <div className="flex items-center justify-center bg-[#222328] border-[#606064] rounded relative mb-3">
                <Input
                  className="rounded bg-[#222328] h-[40px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
                  placeholder="Playlist Name"
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end mt-2">
                <Button
                  variant="ghost"
                  className="h-8"
                  onClick={() => setShowCreatePlaylist(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-8 w-14 button_variant_1 text-black"
                  onClick={handleCreatePlaylist}
                  disabled={!playlistName.length}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showCreatePlaylist && (
          <div
            className="p-3 hover:bg-[#222328] hover:rounded border-b border-[#222328] flex items-center cursor-pointer"
            onClick={handleToggleCreatePlaylist}
          >
            <IoMdAdd size={20} className="mr-3" />
            <h1>New Playlist</h1>
          </div>
        )}

        <div className="flex flex-col h-96 md:h-56">
          {/* Favorites and Playlist List */}
          <div className="flex flex-col mt-2 overflow-y-scroll custom-scrollbar">
            {/* Favorites Section */}
            <div className="flex items-center p-3 rounded hover:bg-[#222328] cursor-pointer justify-between">
              <div className="flex items-center">
                <img src={FavImg} alt="Favorites" className="h-8 w-8 rounded" />
                <h2 className="ml-4">Favorites</h2>
              </div>
              {Favorites.includes(songId) ? (
                <MdFavorite
                  size={22}
                  cursor="pointer"
                  color="#59c2ef"
                  onClick={() => handleFavorite(songId)}
                />
              ) : (
                <IoMdAddCircle
                  size={22}
                  cursor="pointer"
                  color="#59c2ef"
                  onClick={() => handleFavorite(songId)}
                />
              )}
            </div>

            {/* Playlist List */}
            {playlists
              ?.filter((playlist) =>
                playlist.name
                  .toLowerCase()
                  .includes(searchPlaylist.toLowerCase())
              )
              .map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center p-3 rounded hover:bg-[#222328] cursor-pointer justify-between"
                >
                  <div className="flex items-center">
                    {playlist.image ? (
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="h-8 w-8 rounded"
                      />
                    ) : (
                      <BiSolidPlaylist size={20} color="#59c2ef" />
                    )}
                    <h2 className="ml-4">{playlist.name}</h2>
                  </div>
                  {selectedPlaylists.includes(playlist.id) ? (
                    <FaCheckCircle
                      size={18}
                      cursor="pointer"
                      color="#59c2ef"
                      onClick={() => togglePlaylistSelection(playlist.id)}
                    />
                  ) : (
                    <IoMdAddCircle
                      size={20}
                      cursor="pointer"
                      color="#59c2ef"
                      onClick={() => togglePlaylistSelection(playlist.id)}
                    />
                  )}
                </div>
              ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end mt-4">
            <Button variant="ghost" className="h-8" onClick={hideAddToPlaylist}>
              Cancel
            </Button>
            <Button
              className="h-8 w-14 button_variant_1 text-black"
              onClick={async () => {
                await handleSaveChanges();
                hideAddToPlaylist();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddToPlaylist;
