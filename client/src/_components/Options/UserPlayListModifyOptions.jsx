import { motion } from "framer-motion";
import tuneMateInstance from "@/service/api/api";
import { mutate as globalMutate } from "swr";
import { useNavigate } from "react-router-dom";
import Toast from "@/utils/Toasts/Toast";
import useModalStore from "@/store/use-modal-store";
import usePlayerStore from "@/store/use-player";

const UserPlayListModifyOptions = ({ single_playlist }) => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { setPlaylistForEdit } = usePlayerStore();

  const handleDeletePlaylist = async () => {
    const choose = confirm(
      `Are you sure you want to delete playlist ${single_playlist.name}?`
    );
    if (choose) {
      try {
        await tuneMateInstance.deleteUserPlaylist(single_playlist.id);
        navigate("/");

        // Use global mutate to update the sidebar playlists
        await globalMutate("user-playlists");

        Toast({
          type: "success",
          message: `Deleted Playlist ${single_playlist.name}`
        });
      } catch (error) {
        Toast({
          type: "error",
          message: "Failed to delete playlist. Please try again."
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.4 }}
      className="absolute top-8 left-2 flex flex-col w-36 mt-2 mb-2 rounded-lg z-50 
             bg-[#242429] border border-[#2D2E35] shadow-lg"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <button
        className="text-white text-sm font-medium p-2 cursor-default hover:bg-[#3E3F46] rounded-t-lg"
        onClick={() => {
          setPlaylistForEdit({
            name: single_playlist.name,
            id: single_playlist.id
          });
          openModal("EDIT_PLAYLIST");
        }}
      >
        Edit Details
      </button>

      <button
        className="text-white text-sm font-medium p-2 pb-[9px] cursor-default hover:bg-[#3E3F46] rounded-b-lg"
        onClick={handleDeletePlaylist}
      >
        Delete Playlist
      </button>
    </motion.div>
  );
};

export default UserPlayListModifyOptions;
