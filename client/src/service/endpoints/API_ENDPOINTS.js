export const ENDPOINTS = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    ManageSongInFavorites: 'api/meta/songs/favorites',
    favorites: 'api/meta/user/favorites',
    updatePlayerState: 'api/meta/user/updatePlayerState',
    loadPlayerState: 'api/meta/user/getPlayerState',
    createNewPlaylist: 'api/playlists/createNewPlaylist',
    getPlaylists: 'api/playlists/all',
    saveSongInPlaylist: 'api/playlists/songs/saveSongInPlaylist',
    removeSongFromPlaylist: 'api/playlists/songs/removeSongFromPlaylist',
    recommended: 'api/tunemate/recommended',
    createRecommended: 'api/tunemate/createRecommended',
    addSongToRecommended: 'api/tunemate/recommended/add',
    removeSongFromRecommended: 'api/tunemate/recommended/remove',
    playlist: (id) => `api/playlists/user/playlist/${id}`,
    recommendedPlaylist: (id) => `api/tunemate/recommended/${id}`,
};

