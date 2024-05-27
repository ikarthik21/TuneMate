import {create} from 'zustand';
import MusicServiceInstance from '@/service/api/music_apis.js';

const usePlayerStore = create((set) => ({
    isLoading: false,
    song: null,
    error: null,
    isPlaying: false,
    setIsPlaying: (value) => set({isPlaying: value}),
    playSong: async (id) => {
        set({isLoading: true, error: null});
        try {
            const response = await MusicServiceInstance.getSingleSong(id);
            const result = response[0];
            set({isLoading: false, isPlaying: true, song: result});

        } catch (error) {
            set({isLoading: false, error: 'Error fetching song'});
        }
    },

}));

export default usePlayerStore;
