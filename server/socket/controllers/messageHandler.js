import MESSAGE_TYPES from "../utils/messageTypes.js";
import SyncControllerInstance from "./SyncController.js";
export const handleMessage = async (ws, data) => {
  const { type, payload } = data;

  switch (type) {
    case MESSAGE_TYPES.CONNECTION_REQUEST:
      const { connectId, senderUsername, senderId } = payload;
      SyncControllerInstance.sendConnectionRequest(
        connectId,
        senderUsername,
        senderId
      );
      break;

    case MESSAGE_TYPES.CONNECTION_ACCEPTED:
      SyncControllerInstance.acceptConnectionRequest(payload);
      break;

    case MESSAGE_TYPES.CONNECTION_DECLINED:
      SyncControllerInstance.declineConnectionRequest(payload);
      break;

    case MESSAGE_TYPES.SYNC_ACTION:
      SyncControllerInstance.syncAction(payload);
      break;

    case MESSAGE_TYPES.CLOSE_CONNECTION:
      SyncControllerInstance.closeConnection(payload);
      break;

    default:
      console.error("Unknown message type:", type);
  }
};
