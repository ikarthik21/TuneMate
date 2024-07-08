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
    playlist: (id) => `api/playlists/user/playlist/${id}`,

};

