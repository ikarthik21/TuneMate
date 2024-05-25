import {create} from 'zustand';
import {jwtDecode} from "jwt-decode";

const useAuthStore = create((set) => ({
    accessToken: getAccessToken(),
    isAuthenticated: !!getAccessToken(),
    username: getUsernameFromToken(getAccessToken()),
    setAccessToken: (token) => {
        document.cookie = `accessToken=${token}; path=/;`;
        const decodedToken = jwtDecode(token);
        set({
            accessToken: token, isAuthenticated: true, username: decodedToken.username,
        });
    },
    removeAccessToken: () => {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
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
