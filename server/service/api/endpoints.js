const ENDPOINTS = {
    search: (query) => `/search?query=${query}`,
    song: (id) => `/songs/${id}`,
    album: (id) => `/albums?id=${id}`,
    artist: (id) => `/artists?id=${id}`,
    playlist: (id) => `/playlists?id=${id}`,
};

export default ENDPOINTS;
