import MusicServiceInstance from "@/service/api/music_apis.js";
import tuneMateInstance from "@/service/api/api.js";
 

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export function truncateString(str, length) {
  if (typeof str !== "string") {
    return "";
  }
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function decodeHtmlEntities(text) {
  if (typeof text !== "string") {
    return "";
  }
  const element = document.createElement("div");
  if (text) {
    element.innerHTML = text;
  }
  return element.textContent || element.innerText || "";
}

export const getAllArtists = (song) => {
  const artists =
    song?.artists.primary.map((artist) => artist.name).join("  ") || "";
  return truncateString(artists, 50);
};

export const fetchPlaylistData = async (id, type) => {
  if (type === "ALBUM") {
    return await MusicServiceInstance.getAlbumById(id);
  } else if (type === "PLAYLIST") {
    return await MusicServiceInstance.getPlaylistById(id);
  } else if (type === "ARTIST") {
    const data = await MusicServiceInstance.getArtistById(id);
    return { songs: data.topSongs };
  } else if (type === "USER_PLAYLIST") {
    return await tuneMateInstance.getUserPlaylist(id);
  } else if (type === "FAVORITES") {
    const data = await tuneMateInstance.getFavorites();
    return { id: "FAVORITES", songs: data };
  } else if (type === "RECOMMENDED_PLAYLIST") {
    return await tuneMateInstance.getRecommendedPlaylist(id);
  }
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return years === 1 ? "1 year ago" : `${years} years ago`;
  if (months > 0) return months === 1 ? "1 month ago" : `${months} months ago`;
  if (weeks > 0) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes > 0)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
};

export const formatPlayCount = (number) => {
  let numStr = number.toString();
  let [integerPart, decimalPart] = numStr.split(".");

  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);
  const formattedInteger =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherDigits ? "," : "") +
    lastThreeDigits;

  return decimalPart ? formattedInteger + "." + decimalPart : formattedInteger;
};

 