import Modal from "../Modals/Modal";
import useFormData from "@/hooks/useFormData";
import tuneMateInstance from "@/service/api/api";
import usePlayerStore from "@/store/use-player";
import Toast from "@/utils/Toasts/Toast";
import { mutate as globalMutate } from "swr";
import useModalStore from "@/store/use-modal-store";

const EditPlayList = () => {
  const { playlistForEdit } = usePlayerStore();
  const { closeModal } = useModalStore();

  const { data, handleChange, handleSubmit, isLoading, resetData } =
    useFormData(
      {
        newPlaylistName: "",
        playlistForEdit
      },
      tuneMateInstance.editUserPlaylist
    );

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleSubmit(playlistForEdit.id);
      if (response.data) {
        Toast({ type: response.data.type, message: response.data.message });
        resetData();
        // Use global mutate to update the sidebar playlists
        await globalMutate("user-playlists");
        await globalMutate(["user-playlist", playlistForEdit.id]);
        closeModal();
      }
    } catch (error) {
      Toast({
        type: "error",
        message: "Failed to edit playlist. Please try again."
      });
    }
  };

  return (
    <Modal>
      <div className="p-4 w-96">
        <h2 className="text-xl">Edit Playlist </h2>
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleEdit}>
          <input
            type="text"
            placeholder="Playlist Name"
            name="newPlaylistName"
            onChange={handleChange}
            defaultValue={playlistForEdit?.name}
            className="p-2 border border-gray-300 rounded text-black outline-none text-md font-sans"
          />
          <input
            type="submit"
            value={"Save"}
            className="bg-[#59c2ef] p-1 rounded cursor-pointer text-md font-semibold"
          />
        </form>
      </div>
    </Modal>
  );
};

export default EditPlayList;
