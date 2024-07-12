import {create} from 'zustand';
import {jwtDecode} from "jwt-decode";
import {tuneMateClient} from '@/service/api/api.js';

const useAuthStore = create((set) => ({
    accessToken: getAccessToken(),
    isAuthenticated: !!getAccessToken(),
    username: getUsernameFromToken(getAccessToken()),
    role: getUserRole(),
    setAccessToken: (token) => {
        const decodedToken = jwtDecode(token);
        document.cookie = `role=${decodedToken.role}; path=/;`;
        document.cookie = `accessToken=${token}; path=/;`;
        set({
            accessToken: token, isAuthenticated: true, username: decodedToken.username, role: decodedToken.role
        });
    },
    removeAccessToken: () => {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        delete tuneMateClient.defaults.headers['Authorization'];
        set({accessToken: null, isAuthenticated: false, username: null});
    },
}));

function getAccessToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
            return value;
        }
    }
    return null;
}

function getUserRole() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'role') {
            return value;
        }
    }
    return null;
}

function getUsernameFromToken(token) {
    if (!token) return null;
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.username || null;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}

export default useAuthStore;
