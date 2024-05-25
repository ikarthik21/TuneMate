import axios from 'axios';
import {ENDPOINTS} from "@/service/MUSIC_ENDPOINTS.js";


const apiClient = axios.create({
    baseURL: 'https://saavn.dev/api', timeout: 10000, headers: {'Content-Type': 'application/json'}
});


export const getSearchResults = async (query) => {
    try {
        const response = await apiClient.get(ENDPOINTS.search(query));
        return response.data.data;
    } catch (err) {
        return err;
    }
};
