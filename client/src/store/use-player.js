import {create} from 'zustand';
import MusicServiceInstance from '@/service/api/music_apis.js';
import tuneMateInstance from '@/service/api/api.js';
import {throttle} from 'lodash';
import {fetchPlaylistData} from '@/utils/MusicUtils.js';

const usePlayerStore = create((set, get) => ({
    isLoading: false,
    song: null,
    error: null,
    playlist: {},
    isPlaying: false,
    songId: '',
    currentSongIndex: null,
    volume: 50,
    Favorites: [],

    setVolume: async (value) => {
        try {
            set({volume: value});
            await tuneMateInstance.updatePlayerState({Volume: value});
        } catch (error) {
            console.error('Failed to set volume', error);
        }
    },

    setIsPlaying: (value) => {
        set({isPlaying: value});
    },

    playSong: async (id) => {
        set({isLoading: true, error: null, songId: id});
        try {
            const response = await MusicServiceInstance.getSingleSong(id);
            const result = response[0];
            set((state) => ({
                ...state, isLoading: false, isPlaying: true, song: result
            }));
            await tuneMateInstance.updatePlayerState({songId: id});
        } catch (error) {
            console.error('Error fetching song', error);
            set({isLoading: false, error: 'Error fetching song'});
        }
    },

    loadPlaylist: async ({id, type, index}) => {
        try {
            const data = await fetchPlaylistData(id, type);
            const songs = data.songs || [];
            set({playlist: {id: data.id, songs}});
            const currentSongIndex = index === 0 ? 0 : get().currentSongIndex;
            set({currentSongIndex});
            if (songs.length > 0) {
                if (index === 0) await get().playSong(songs[currentSongIndex].id);
                await tuneMateInstance.updatePlayerState({
                    playListId: id, currentSongIndex: currentSongIndex, playListType: type
                });
            } else {
                console.warn('No songs found in the playlist');
            }
        } catch (error) {
            console.error(`Error loading playlist (ID: ${id}, Type: ${type})`, error.message, error.stack);
        }
    },

    playNext: throttle(async () => {
        const {playlist, currentSongIndex} = get();
        if (currentSongIndex === null || currentSongIndex >= playlist.songs.length - 1) {
            return;
        }
        const nextIndex = currentSongIndex + 1;
        set({currentSongIndex: nextIndex});
        await tuneMateInstance.updatePlayerState({currentSongIndex: nextIndex});
        await get().playSong(playlist.songs[nextIndex].id);
    }, 500),

    playPrevious: throttle(async () => {
        const {playlist, currentSongIndex} = get();
        if (currentSongIndex === null || currentSongIndex <= 0) {
            return;
        }
        const prevIndex = currentSongIndex - 1;
        set({currentSongIndex: prevIndex});
        await get().playSong(playlist.songs[prevIndex].id);
        await tuneMateInstance.updatePlayerState({currentSongIndex: prevIndex});
    }, 500),

    playSongByIndex: async (index) => {
        const {playlist} = get();
        if (index < 0 || index >= playlist.songs.length) {
            return;
        }
        set({currentSongIndex: index});
        await tuneMateInstance.updatePlayerState({currentSongIndex: index});
        await get().playSong(playlist.songs[index].id);
    },

    loadPlayerState: async () => {
        try {
            const {playerState} = await tuneMateInstance.getPlayerState();
            const {songId, currentSongIndex, playListId, Volume, playListType} = playerState;
            set({currentSongIndex});
            set({volume: Volume});
            await get().loadPlaylist({id: playListId, type: playListType});
            await get().playSong(songId);
        } catch (error) {
            console.error('Error loading player state', error.message, error.stack);
        }
    },
    getFavorites: async () => {
        const data = await tuneMateInstance.getFavorites();
        const Favorites = data.map(item => item.id);
        set({Favorites: Favorites});
    }
}));

export default usePlayerStore;
