import { create } from "zustand";

const useWebSocketStore = create((set, get) => ({
  socket: null,
  connected: false,
  connectionStatus: false,
  connectId: null,
  userDetails: null,
  setUserDetails: (userDetails) => set({ userDetails }),
  setConnectId: (connectId) => set({ connectId }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setSocket: (socket) => set({ socket }),

  connectWebSocket: (userId) => {
    const baseURL = import.meta.env.VITE_SOCKET_SERVER_URL;
    const socket = new WebSocket(`${baseURL}?userId=${userId}`);
    socket.onopen = () => {
      set({ connected: true, socket });
    };

    socket.onmessage = (event) => {
      JSON.parse(event.data);
    };

    socket.onclose = () => {
      set({ connected: false, socket: null });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      set({ connected: false, socket: null });
    };
  },

  closeWebSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ connected: false, socket: null });
    }
  }
}));

export default useWebSocketStore;
