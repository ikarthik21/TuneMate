import {create} from 'zustand';
import MusicServiceInstance from '@/service/api/music_apis.js';

const usePlayerStore = create((set, get) => ({ // Added get parameter
    isLoading: false,
    song: null,
    error: null,
    playlist: [],
    isPlaying: false,
    currentSongIndex: null,
    volume: 60,
    setVolume: (value) => set({volume: value}),
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
    loadPlaylist: async (songs) => {
        set({playlist: songs, currentSongIndex: 0});
        if (songs.length > 0) {
            await get().playSong(songs[0].id);
        }
    },
    playNext: async () => {
        const {playlist, currentSongIndex} = get();
        if (currentSongIndex === null || currentSongIndex === playlist.length - 1) {
            return;
        }
        const nextIndex = currentSongIndex + 1;
        set({currentSongIndex: nextIndex});
        await get().playSong(playlist[nextIndex].id);
    },
    playPrevious: async () => {
        const {playlist, currentSongIndex} = get();
        if (currentSongIndex === null || currentSongIndex === 0) {
            return;
        }
        const prevIndex = currentSongIndex - 1;
        set({currentSongIndex: prevIndex});
        await get().playSong(playlist[prevIndex].id);
    },
    playSongByIndex: async (index) => {
        const {playlist} = get();
        if (index < 0 || index >= playlist.length) {
            return;
        }
        set({currentSongIndex: index});
        await get().playSong(playlist[index].id);
    },

}));

export default usePlayerStore;
