import { create } from 'zustand';

const useWebSocketStore = create((set, get) => ({
    socket: null,
    connected: false,
    connectionStatus: false,
    connectId: null,
    setConnectId: (connectId) => set({ connectId }),
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setSocket: (socket) => set({ socket }),

    connectWebSocket: (userId) => {
        const socket = new WebSocket(`ws://localhost:4100?userId=${userId}`);

        socket.onopen = () => {
            set({ connected: true, socket });
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received data:', data);
        };

        socket.onclose = () => {
            set({ connected: false, socket: null });
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            set({ connected: false, socket: null });
        };
    },

    closeWebSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ connected: false, socket: null });
        }
    },
}));

export default useWebSocketStore;
