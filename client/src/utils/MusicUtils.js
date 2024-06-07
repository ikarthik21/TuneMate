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