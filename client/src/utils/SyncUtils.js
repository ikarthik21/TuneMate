import useWebSocketStore from "@/store/use-socket.js";
import useAuthStore from "@/store/use-auth.js";
import { encryptUserId } from "@/utils/MusicUtils.js";

export const broadcastAction = (action, payload = {}) => {
  const socketConnection = useWebSocketStore.getState().socket;
  const connectionStatus = useWebSocketStore.getState().connectionStatus;

  if (socketConnection && connectionStatus) {
    socketConnection.send(
      JSON.stringify({
        type: "SYNC_ACTION",
        payload: {
          action,
          senderId: encryptUserId(useAuthStore.getState().userId),
          ...payload
        }
      })
    );
  }
};
