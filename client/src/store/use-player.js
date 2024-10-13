import { create } from 'zustand';
import MusicServiceInstance from '@/service/api/music_apis.js';
import tuneMateInstance from '@/service/api/api.js';
import { debounce, throttle } from 'lodash';
import { fetchPlaylistData, getAllArtists } from '@/utils/MusicUtils.js';
import { createRef } from 'react';
import { mutate } from "swr";
import useWebSocketStore from './use-socket';
import useAuthStore from './use-auth';
import { persist } from 'zustand/middleware';

// Utility function for random index
const getRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

// Error class for player-related issues
class PlayerError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

const usePlayerStore = create(persist(
    (set, get) => ({
        isLoading: false,
        song: null,
        error: null,
        playlist: {},
        isPlaying: false,
        songId: '',
        currentSongIndex: null,
        volume: 50,
        Favorites: [],
        AudioRef: createRef(),
        onLoop: false,
        isShuffling: false,

        setVolume: async (value) => {
            try {
                set({ volume: value });
            } catch (error) {
                console.error('Failed to set volume', error);
            }
        },

        setIsPlaying: (value) => {
            set({ isPlaying: value });
        },

        playSong: async (id) => {
            const actionQueue = [];
            actionQueue.push(async () => {
                set({ isLoading: true, error: null, songId: id });
                try {
                    const socketConnection = useWebSocketStore.getState().socket;
                    const connectionStatus = useWebSocketStore.getState().connectionStatus;

                    if (socketConnection && connectionStatus) {
                        socketConnection.send(JSON.stringify({
                            type: "SYNC_ACTION",
                            payload: { action: "PLAY_SONG", senderId: useAuthStore.getState().userId, songId: id }
                        }));
                    }

                    const response = await MusicServiceInstance.getSingleSong(id);
                    if (!response || !response[0]) throw new PlayerError('Song not found', 404);

                    const result = response[0];
                    set((state) => ({
                        ...state, isLoading: false, isPlaying: true, song: result
                    }));

                    await tuneMateInstance.updatePlayerState({ songId: id });
                    await tuneMateInstance.addSongToHistory({
                        song: {
                            id: result.id,
                            name: result.name,
                            duration: result.duration,
                            image: result.image[2].url,
                            artists: getAllArtists(result),
                            album: result.album.name
                        }
                    });
                } catch (error) {
                    console.error('Error fetching song', error);
                    set({ isLoading: false, error: error instanceof PlayerError ? error.message : 'Error fetching song' });
                }
                mutate("user-song-history");
            });

            if (actionQueue.length === 1) {
                while (actionQueue.length > 0) {
                    await actionQueue[0]();
                    actionQueue.shift();
                }
            }
        },

        loadPlaylist: async ({ id, type, index }) => {
            try {
                const data = await fetchPlaylistData(id, type);
                const songs = data?.songs || [];
                set({ playlist: { id: data?.id, songs } });

                const currentSongIndex = index === 0 ? 0 : get().currentSongIndex;
                set({ currentSongIndex });

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
            const { playlist, currentSongIndex, isShuffling } = get();
            if (playlist.songs.length === 0) return;

            let nextIndex;
            if (isShuffling) {
                nextIndex = getRandomIndex(playlist.songs.length, currentSongIndex);
            } else {
                nextIndex = (currentSongIndex + 1) % playlist.songs.length;
            }
            set({ currentSongIndex: nextIndex });
            await tuneMateInstance.updatePlayerState({ currentSongIndex: nextIndex });
            await get().playSong(playlist.songs[nextIndex].id);
        }, 500),

        playPrevious: throttle(async () => {
            const { playlist, currentSongIndex, isShuffling } = get();
            if (playlist.songs.length === 0) return;

            let prevIndex;
            if (isShuffling) {
                prevIndex = getRandomIndex(playlist.songs.length, currentSongIndex);
            } else {
                prevIndex = (currentSongIndex - 1 + playlist.songs.length) % playlist.songs.length;
            }
            set({ currentSongIndex: prevIndex });
            await tuneMateInstance.updatePlayerState({ currentSongIndex: prevIndex });
            await get().playSong(playlist.songs[prevIndex].id);
        }, 500),
        playSongByIndex: async (index) => {
            const { playlist } = get();
            if (index < 0 || index >= playlist.songs.length) return;
            set({ currentSongIndex: index });
            await tuneMateInstance.updatePlayerState({ currentSongIndex: index });
            await get().playSong(playlist.songs[index].id);
        },

        loadPlayerState: async () => {
            try {
                const { playerState } = await tuneMateInstance.getPlayerState();
                const { songId, currentSongIndex, playListId, playListType, onLoop, isShuffling } = playerState;

                set({ currentSongIndex, onLoop, isShuffling });
                await get().loadPlaylist({ id: playListId, type: playListType });
                await get().playSong(songId);
            } catch (error) {
                console.error('Error loading player state', error.message, error.stack);
            }
        },

        getFavorites: async () => {
            try {
                const data = await tuneMateInstance.getFavorites();
                const Favorites = data.map(item => item.id);
                set({ Favorites });
            } catch (error) {
                console.error('Error fetching favorites', error.message);
            }
        },

        handleAudioPlay: debounce(async () => {
            const audio = get().AudioRef.current;
            if (!audio) return;

            try {
                if (audio.paused) {
                    await audio.play();
                    set({ isPlaying: true });
                } else {
                    await audio.pause();
                    set({ isPlaying: false });
                }
            } catch (error) {
                console.error("Error in handleAudioPlay:", error);
            }

            if (audio) {
                audio.onended = async () => {
                    if (get().onLoop) {
                        audio.currentTime = 0;
                        await audio.play();
                    } else {
                        await get().playNext();
                    }
                };
            }
        }, 300),

        handleSongLoop: async () => {
            let currentStatus = get().onLoop;
            set({ onLoop: !currentStatus });
            await tuneMateInstance.updatePlayerState({ onLoop: !currentStatus });
        },

        handleShuffle: async () => {
            let currentStatus = get().isShuffling;
            set({ isShuffling: !currentStatus });
            await tuneMateInstance.updatePlayerState({ isShuffling: !currentStatus });
        },
    }),
    {
        name: 'player-state', // persist player state
        partialize: (state) => ({ volume: state.volume, currentSongIndex: state.currentSongIndex })
    }
));

export default usePlayerStore;
