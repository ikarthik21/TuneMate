import { create } from "zustand";

const useModalStore = create(set => ({
  isOpen: false,
  component: null,
  openModal: component => set({ isOpen: true, component }),
  closeModal: () => set({ isOpen: false, component: null })
}));

export default useModalStore;
