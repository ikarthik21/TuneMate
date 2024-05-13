import { create } from 'zustand';


export const useAuth = create((set) => ({
    user: {},
    onExpand: () => set(() => ({ collapse: false })),
    onCollapse: () => set(() => ({ collapse: true })),
}));