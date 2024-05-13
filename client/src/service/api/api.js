import axios from 'axios';
import Cookies from 'js-cookie';
import {LOGIN, REGISTER} from "@/service/API_ENDPOINTS.js";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const token = Cookies.get('token');

const axiosInstance = axios.create({
    baseURL, headers: {
        'Authorization': token ? `Bearer ${token}` : undefined
    }
});

export const loginUser = async (data) => {
    try {
        const resp = await axiosInstance.post(LOGIN, data);
        return resp.data;
    } catch (err) {
        return err;
    }
};


export const registerUser = async (data) => {
    try {
        const resp = await axiosInstance.post(REGISTER, data);
        return resp.data;
    } catch (err) {
        return err;
    }
};
