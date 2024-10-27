import { create } from 'zustand';

const useUserSyncStore = create((set) => ({
    isUserSyncVisible: false,
    showUserSync: () => {
        set({ isUserSyncVisible: true })
    },
    hideUserSync: () => set({ isUserSyncVisible: false }),
}));

export default useUserSyncStore;
