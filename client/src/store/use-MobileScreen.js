import { create } from "zustand";

const useMobileScreen = create((set) => ({
  isFullScreen: false,
  openFullScreen: () => set(() => ({ isFullScreen: true })),
  closeFullScreen: () => set(() => ({ isFullScreen: false }))
}));

export default useMobileScreen;
