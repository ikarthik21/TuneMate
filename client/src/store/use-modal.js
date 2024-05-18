import {create} from 'zustand';

const useModalStore = create((set) => ({
    isModalOpen: false,
    ModalOpen: () => set({isOpen: true}),
    ModalClose: () => set({isOpen: false}),
}));

export default useModalStore;
