const ENDPOINTS = {
  login: "/login",
  resendVerificationMail: "/resendVerificationMail",
  forgot: "/forgotPassword",
  verify: "/verify",
  resetPassword: "/resetPassword",
  register: "/register",
  ManageSongInFavorites: "/songs/favorites",
  favorites: "/user/favorites",
  updatePlayerState: "/user/updatePlayerState",
  updateSyncState: "/user/updateSyncState",
  getPlayerState: "/user/getPlayerState",
  addSongToHistory: "/user/addSongToHistory",
  getUserSongHistory: "/user/SongsHistory",
  createNewPlaylist: "/createNewPlaylist",
  getPlaylists: "/all",
  saveSongInPlaylist: "/songs/saveSongInPlaylist",
  removeSongFromPlaylist: "/songs/removeSongFromPlaylist",
  playlist: "/user/playlist/:id",
  recommended: "/tunemate/recommended",
  createRecommended: "/tunemate/createRecommended",
  addSongToRecommended: "/tunemate/recommended/add",
  removeSongFromRecommended: "/tunemate/recommended/remove",
  recommendedPlaylist: `/tunemate/recommended/:id`
};

export default ENDPOINTS;
