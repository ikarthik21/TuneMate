import {create} from 'zustand';

const useWebSocketStore = create((set, get) => ({
    socket: null,
    setSocket: (socket) => set({socket}),
    targetUserId: "",
    setTargetUserId: (id) => {
        console.log(id)
        set({targetUserId: id})
    },
    send: (message) => {
        const {socket} = get();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    },
    close: () => {
        const {socket} = get();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    },
}));

export default useWebSocketStore;
