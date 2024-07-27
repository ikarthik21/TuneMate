import {create} from 'zustand';

const useConnectBoxStore = create((set) => ({
    isConnectVisible: false,
    socket: null,
    showConnectBox: () => {
        set({isConnectVisible: true})
    },
    hideConnectBox: () => set({isConnectVisible: false}),
}));

export default useConnectBoxStore;
