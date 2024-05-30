import axios from 'axios';
import {ENDPOINTS} from "@/service/MUSIC_ENDPOINTS.js";


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


}


const MusicServiceInstance = new MusicService();

export default MusicServiceInstance;
