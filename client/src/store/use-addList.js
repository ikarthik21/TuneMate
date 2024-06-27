import {create} from 'zustand';

const useAddListStore = create((set) => ({
    isAddToPlaylistVisible: false,
    songId: null,
    component: "",
    showAddToPlaylist: (songId, component) => {

        set({isAddToPlaylistVisible: true, songId, component: component})
    },
    hideAddToPlaylist: () => set({isAddToPlaylistVisible: false, songId: null}),
}));

export default useAddListStore;
