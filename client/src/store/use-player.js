import {create} from 'zustand';
import MusicServiceInstance from '@/service/api/music_apis.js';
import tuneMateInstance from "@/service/api/api.js";

const usePlayerStore = create((set, get) => ({
    isLoading: false, song: null, error: null, playlist: {}, isPlaying: false, currentSongIndex: null, volume: 60,

    setVolume: (value) => {
        set({volume: value});
        get().savePlayerState();
    },

    setIsPlaying: (value) => set({isPlaying: value}),

    playSong: async (id) => {
        set({isLoading: true, error: null});
        try {
            const response = await MusicServiceInstance.getSingleSong(id);
            const result = response[0];
            set((state) => {
                const newState = {...state, isLoading: false, isPlaying: true, song: result};
                tuneMateInstance.savePlayerState(newState);
                return newState;
            });
        } catch (error) {
            set({isLoading: false, error: 'Error fetching song'});
        }
    },

    loadPlaylist: async (list) => {
        set({playlist: list, currentSongIndex: 0});
        if (list.songs.length > 0) {
            await get().playSong(list.songs[0].id);
        }
    },

    playNext: async () => {
        const {playlist, currentSongIndex} = get();
        if (currentSongIndex === null || currentSongIndex >= playlist.songs.length - 1) {
            return;
        }
        const nextIndex = currentSongIndex + 1;
        set({currentSongIndex: nextIndex});
        await get().playSong(playlist.songs[nextIndex].id);
    },

    playPrevious: async () => {
        const {playlist, currentSongIndex} = get();
        if (currentSongIndex === null || currentSongIndex <= 0) {
            return;
        }
        const prevIndex = currentSongIndex - 1;
        set({currentSongIndex: prevIndex});
        await get().playSong(playlist.songs[prevIndex].id);
    },

    playSongByIndex: async (index) => {
        const {playlist} = get();
        if (index < 0 || index >= playlist.songs.length) {
            return;
        }
        set({currentSongIndex: index});
        await get().playSong(playlist.songs[index].id);
    }, loadPlayerState: async () => {
        try {
            const {playerState} = await tuneMateInstance.getPlayerState();
            set(playerState);
        } catch (err) {
            console.log(err);
        }
    },
    savePlayerState: async () => {
        const {song, playlist, isPlaying, currentSongIndex, volume, currentTime} = get();
        const state = {song, playlist, isPlaying, currentSongIndex, volume, currentTime};
        await tuneMateInstance.savePlayerState(state);
    },
}));

export default usePlayerStore;
