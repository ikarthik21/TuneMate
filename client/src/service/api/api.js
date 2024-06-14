import axios from 'axios';
import Cookies from 'js-cookie';
import {ENDPOINTS} from "@/service/API_ENDPOINTS.js";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const token = Cookies.get('accessToken');

export const tuneMateClient = axios.create({
    baseURL, headers: {
        'Authorization': token ? `Bearer ${token}` : undefined
    }
});


class TuneMateService {
    loginUser = async (data) => {
        try {
            const response = await tuneMateClient.post(ENDPOINTS.login, data);
            return response.data;
        } catch (err) {
            return err;
        }
    }

    registerUser = async (data) => {
        try {
            const response = await tuneMateClient.post(ENDPOINTS.register, data);
            return response.data;
        } catch (err) {
            return err;
        }
    };

    ManageSongInFavorites = async (id) => {
        try {
            const response = await tuneMateClient.post(ENDPOINTS.ManageSongInFavorites, {id});
            return response.data;
        } catch (err) {
            return err;
        }
    }

    getFavorites = async () => {
        try {
            const response = await tuneMateClient.get(ENDPOINTS.favorites);
            return response.data.favorites;
        } catch (err) {
            return err;
        }
    }
    updatePlayerState = async (state) => {
        try {
            const response = await tuneMateClient.post(ENDPOINTS.updatePlayerState, {state});
            return response.data;
        } catch (err) {
            return err;
        }
    }
    getPlayerState = async () => {
        try {
            const response = await tuneMateClient.get(ENDPOINTS.loadPlayerState);
            return response.data;
        } catch (err) {
            return err;
        }
    }

}

const tuneMateInstance = new TuneMateService();

export default tuneMateInstance;