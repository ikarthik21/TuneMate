import { useCallback, useEffect, useState } from "react";
import tuneMateInstance from "@/service/api/api.js";
import Toast from "@/utils/Toasts/Toast.js";
import ImageToast from "@/utils/Toasts/ImageToast.jsx";
import useSWR, { mutate } from "swr";
import useAuthStore from "@/store/use-auth.js";
import usePlayerStore from "@/store/use-player.js";
import { getAllArtists } from "@/utils/MusicUtils.js";

const useAddToPlaylist = () => {
  const { song } = usePlayerStore();
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
    if (playlists && playlists.length > 0 && song) {
      const initialSelectedPlaylists = playlists
        .filter((playlist) => playlist.songs.includes(song.id))
        .map((playlist) => playlist.id);
      setSelectedPlaylists(initialSelectedPlaylists);
      setInitialPlaylists(initialSelectedPlaylists);
    }
  }, [playlists, song]);

  const togglePlaylistSelection = useCallback((id) => {
    setSelectedPlaylists((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  }, []);

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
      console.error(err);
    }
  };

  const handleToggleCreatePlaylist = () => {
    setShowCreatePlaylist((prevState) => !prevState);
    setPlaylistName("");
  };

  const handleSaveChanges = async () => {
    const artists = getAllArtists(song);

    const { id, name, duration, image, album, playCount } = song;
    const compressedSong = {
      id,
      name,
      duration,
      image: image[2].url,
      artists,
      album: album.name,
      playCount: playCount
    };

    const playlistsToAdd = selectedPlaylists.filter(
      (id) => !initialPlaylists.includes(id)
    );
    const playlistsToRemove = initialPlaylists.filter(
      (id) => !selectedPlaylists.includes(id)
    );

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

    role === "admin"
      ? mutate("tunemate-recommended")
      : mutate("user-playlists");
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
