const ENDPOINTS = {
    login: "/login",
    register: "/register",
    ManageSongInFavorites: '/songs/favorites',
    favorites: "/user/favorites",
    updatePlayerState: "/user/updatePlayerState",
    getPlayerState: "/user/getPlayerState",
    createNewPlaylist: "/createNewPlaylist",
    getPlaylists: "/all",
    saveSongInPlaylist: "/songs/saveSongInPlaylist",
    removeSongFromPlaylist: "/songs/removeSongFromPlaylist",
    playlist: "/user/playlist/:id",
    recommended: "/tunemate/recommended"

}

export default ENDPOINTS;
