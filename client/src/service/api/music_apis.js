import axios from 'axios';
import {ENDPOINTS} from "@/service/endpoints/MUSIC_ENDPOINTS.js";


const apiClient = axios.create({
    baseURL: 'https://saavn.dev/api', timeout: 10000, headers: {'Content-Type': 'application/json'}
});


class MusicService {
    getSearchResults = async (query) => {
        try {
            const response = await apiClient.get(ENDPOINTS.search(query));
            return response.data.data;
        } catch (err) {
            return err;
        }
    }

    getSingleSong = async (songid) => {
        try {
            const response = await apiClient.get(ENDPOINTS.song(songid));
            return response.data.data;
        } catch (err) {
            return err;
        }
    };

    getAlbumById = async (id) => {
        try {
            const response = await apiClient.get(ENDPOINTS.album(id));
            return response.data.data;
        } catch (err) {
            return err;
        }
    }

    getArtistById = async (id) => {
        try {
            const response = await apiClient.get(ENDPOINTS.artist(id));
            return response.data.data;
        } catch (err) {
            return err;
        }

    }

    getPlaylistById = async (id) => {
        try {
            const response = await apiClient.get(ENDPOINTS.playlist(id));
            return response.data.data;
        } catch (err) {
            return err;
        }

    }


}


const MusicServiceInstance = new MusicService();

export default MusicServiceInstance;
