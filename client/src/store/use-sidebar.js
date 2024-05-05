import { create } from 'zustand';


export const useSidebar = create((set) => ({
    collapse: true,
    onExpand: () => set(() => ({ collapse: false })),
    onCollapse: () => set(() => ({ collapse: true })),
}));