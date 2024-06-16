import {create} from 'zustand';

const useAddListStore = create((set) => ({
    isAddToPlaylistVisible: false,
    songId: null,
    showAddToPlaylist: (songId) => set({isAddToPlaylistVisible: true, songId}),
    hideAddToPlaylist: () => set({isAddToPlaylistVisible: false, songId: null}),
}));

export default useAddListStore;
