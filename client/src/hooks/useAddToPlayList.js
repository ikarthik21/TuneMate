import { useCallback, useEffect, useState } from "react";
import tuneMateInstance from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";
import ImageToast from "@/utils/Toasts/ImageToast.jsx";
import useSWR, { mutate } from "swr";
import useAuthStore from "@/store/use-auth.js";
import usePlayerStore from "@/store/use-player.js";
import { getAllArtists } from "@/utils/MusicUtils.js";
 
const useAddToPlaylist = () => {
  const { songForPlayListDropdown } = usePlayerStore();
  const { isAuthenticated, role } = useAuthStore();
  const [playlistName, setPlaylistName] = useState("");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [initialPlaylists, setInitialPlaylists] = useState([]);

  const {
    data: playlists,
    error,
    isLoading
  } = useSWR(
    isAuthenticated
      ? role === "admin"
        ? "tunemate-recommended"
        : "user-playlists"
      : null,
    () =>
      role === "admin"
        ? tuneMateInstance.getTuneMateRecommended()
        : tuneMateInstance.getPlaylists()
  );

  useEffect(() => {
    if (playlists && playlists.length > 0 && songForPlayListDropdown?.id) {
      const initialSelectedPlaylists = playlists
        .filter((playlist) => {
          // Add null check and ensure songs is an array
          const songsList = playlist.songs || [];
          const isIncluded = songsList.includes(songForPlayListDropdown.id);
          return isIncluded;
        })
        .map((playlist) => playlist.id);
      setSelectedPlaylists(initialSelectedPlaylists);
      setInitialPlaylists(initialSelectedPlaylists);
    } else {
      // Reset states when no playlists or song
      setSelectedPlaylists([]);
      setInitialPlaylists([]);
    }
  }, [playlists, songForPlayListDropdown?.id]);

  const togglePlaylistSelection = useCallback(
    (id) => {
      setSelectedPlaylists((prevSelected) => {
        const newSelected = prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id];
        return newSelected;
      });
    },
    [selectedPlaylists]
  );

  const handleCreatePlaylist = async () => {
    try {
      const response = await tuneMateInstance.createNewPlaylist(
        playlistName,
        role
      );
      Toast({ type: response.data.type, message: response.data.message });
      if (response.data.type === "success") {
        setShowCreatePlaylist(false);
        setPlaylistName("");
        role === "admin"
          ? mutate("tunemate-recommended")
          : mutate("user-playlists");
      }
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const handleToggleCreatePlaylist = useCallback(() => {
    setShowCreatePlaylist((prevState) => !prevState);
    setPlaylistName("");
  }, []);

  const handleSaveChanges = async () => {
    if (!songForPlayListDropdown) {
      console.error("No song available to save");
      return;
    }

    const artists = songForPlayListDropdown.artists.primary
      ? getAllArtists(songForPlayListDropdown)
      : songForPlayListDropdown?.artists || "Unknown Artist";
    const { id, name, duration, image, album, playCount } =
      songForPlayListDropdown;

    // Add safety checks
    const compressedSong = {
      id,
      name,
      duration,
      image: Array.isArray(image)
        ? image?.[2]?.url || image?.[0]?.url || ""
        : image || "",
      artists,
      album: album?.name || "",
      playCount: playCount || 0
    };

    const playlistsToAdd = selectedPlaylists.filter(
      (id) => !initialPlaylists.includes(id)
    );
    const playlistsToRemove = initialPlaylists.filter(
      (id) => !selectedPlaylists.includes(id)
    );

    try {
      if (playlistsToAdd.length > 0) {
        const response = await tuneMateInstance.saveSongInPlaylist(
          {
            song: compressedSong,
            playlists: playlistsToAdd
          },
          role
        );
        ImageToast({
          type: response.data.type,
          message: response.data.message,
          image: compressedSong.image
        });
      }

      if (playlistsToRemove.length > 0) {
        const response = await tuneMateInstance.removeSongFromPlaylist(
          {
            id: id,
            playlists: playlistsToRemove
          },
          role
        );
        ImageToast({
          type: response.data.type,
          message: response.data.message,
          image: compressedSong.image
        });
      }

      // Update initial playlists to current selection after successful save
      setInitialPlaylists([...selectedPlaylists]);

      role === "admin"
        ? mutate("tunemate-recommended")
        : mutate("user-playlists");
    } catch (err) {
      console.error("Error saving changes:", err);
      Toast({ type: "error", message: "Failed to save changes" });
    }
  };

  return {
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
    handleSaveChanges,
    setShowCreatePlaylist
  };
};

export default useAddToPlaylist;
