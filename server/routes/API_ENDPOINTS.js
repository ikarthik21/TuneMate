const ENDPOINTS = {
    login: "/auth/login",
    register: "/auth/register",
    ManageSongInFavorites: '/songs/favorites',
    favorites: "/user/favorites",
    updatePlayerState: "/user/updatePlayerState",
    getPlayerState: "/user/getPlayerState",
    createNewPlaylist: "/playlists/createNewPlaylist",
    getPlaylists: "/playlists/all",
    saveSongInPlaylist: "/songs/saveSongInPlaylist",
    removeSongFromPlaylist: "/songs/removeSongFromPlaylist",
    playlist: "/user/playlist/:id",

}

export default ENDPOINTS;
