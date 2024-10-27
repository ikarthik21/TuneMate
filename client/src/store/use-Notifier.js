import { create } from 'zustand';

const useNotifierStore = create((set) => ({
    isNotifierVisible: false,
    showNotifier: () => {
        set({ isNotifierVisible: true })
    },
    hideNotifier: () => set({ isNotifierVisible: false }),
}));

export default useNotifierStore;
