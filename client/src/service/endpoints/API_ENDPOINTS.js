export const ENDPOINTS = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    ManageSongInFavorites: 'api/songs/favorites',
    favorites: 'api/user/favorites',
    updatePlayerState: 'api/user/updatePlayerState',
    loadPlayerState: 'api/user/getPlayerState',
    createNewPlaylist: 'api/playlists/createNewPlaylist',
    getPlaylists: 'api/playlists/all',
    saveSongInPlaylist: 'api/songs/saveSongInPlaylist',
    removeSongFromPlaylist: 'api/songs/removeSongFromPlaylist',
    playlist: (id) => `api/user/playlist/${id}`,

};

