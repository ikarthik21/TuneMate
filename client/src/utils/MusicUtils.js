import MusicServiceInstance from '@/service/api/music_apis.js';
import tuneMateInstance from '@/service/api/api.js';


export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export function truncateString(str, length = 50) {
    if (typeof str !== 'string') {
        return '';
    }
    return str.length > length ? str.substring(0, length) + '...' : str;
}

export function decodeHtmlEntities(text) {
    if (typeof text !== 'string') {
        return '';
    }
    const element = document.createElement('div');
    if (text) {
        element.innerHTML = text;
    }
    return element.textContent || element.innerText || '';
}


export const getAllArtists = (song) => {
    const artists = song?.artists.primary.map(artist => artist.name).join("  ") || "";
    return truncateString(artists, 50);
};


export const fetchPlaylistData = async (id, type) => {
    if (type === "ALBUM") {
        return await MusicServiceInstance.getAlbumById(id);
    } else if (type === "PLAYLIST") {
        return await MusicServiceInstance.getPlaylistById(id);
    } else if (type === "ARTIST") {
        const data = await MusicServiceInstance.getArtistById(id);
        return {songs: data.topSongs}
    } else if (type === "FAVORITES") {
        const data = await tuneMateInstance.getFavorites();
        console.log(data)
        return {id: "FAVORITES", songs: data}
    }
};
