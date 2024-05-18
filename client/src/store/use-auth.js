import {create} from 'zustand';

const useAuthStore = create((set) => ({
    accessToken: getAccessToken(),
    isAuthenticated: !!getAccessToken(),
    setAccessToken: (token) => {
        document.cookie = `accessToken=${token}; path=/;`;
        set({accessToken: token, isAuthenticated: true});
    },
    removeAccessToken: () => {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        set({accessToken: null, isAuthenticated: false});
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

export default useAuthStore;
