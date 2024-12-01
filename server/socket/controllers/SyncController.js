import MESSAGE_TYPES from "../utils/messageTypes.js";
import { getWebSocketByUserId } from "../services/userConnections.js";
import redisClient from "../config/redisClient.js";
import { encryptUserId, decryptUserId } from "../utils/socketUtils.js";

class SyncController {
  // Helper function to validate WebSocket instance
  async getValidWebSocket(userId) {
    const ws = await getWebSocketByUserId(userId);
    if (!ws || typeof ws.send !== "function") {
      console.error(`Invalid WebSocket object for userId: ${userId}.`);
      return null;
    }
    return ws;
  }

  async sendConnectionRequest(targetUserId, username, senderId) {
    const targetWs = await this.getValidWebSocket(targetUserId);
    if (!targetWs) return;

    if (targetUserId === senderId) {
      targetWs.send(
        JSON.stringify({
          type: MESSAGE_TYPES.INVALID_ACTION,
          payload: { message: "You can't self connect" }
        })
      );
      return;
    }
    // Send the connection request message
    targetWs.send(
      JSON.stringify({
        type: MESSAGE_TYPES.CONNECTION_REQUEST,
        payload: { username, senderId: encryptUserId(senderId) }
      })
    );
  }

  async acceptConnectionRequest(payload) {
    const { acceptedBy, sentBy } = payload;
    const senderId = decryptUserId(sentBy.userId);
    const acceptorId = decryptUserId(acceptedBy.userId);
    // Store the active connection in Redis
    await redisClient.hset("activeConnections", senderId, acceptorId);
    await redisClient.hset("activeConnections", acceptorId, senderId);

    const targetWs = await this.getValidWebSocket(senderId);
    if (!targetWs) return;

    // Send the connection accepted message
    targetWs.send(
      JSON.stringify({
        type: MESSAGE_TYPES.CONNECTION_ACCEPTED,
        payload: { acceptedBy: acceptedBy.username }
      })
    );
  }

  async declineConnectionRequest(payload) {
    const { sentBy } = payload;
    const targetWs = await this.getValidWebSocket(decryptUserId(sentBy.userId));
    if (!targetWs) return;
    // Send the connection declined message
    targetWs.send(
      JSON.stringify({
        type: MESSAGE_TYPES.CONNECTION_DECLINED,
        payload: { declinedBy: sentBy.username }
      })
    );
  }

  async syncAction(payload) {
    const { senderId, action } = payload;

    const targetUserId = await redisClient.hget(
      "activeConnections",
      decryptUserId(senderId)
    );

    if (!targetUserId) {
      console.warn(
        `No active connection found for userId: ${decryptUserId(senderId)}`
      );
      return;
    }
    const targetWs = await getWebSocketByUserId(targetUserId);
    if (targetWs) {
      switch (action) {
        case "HANDLE_SONG_PLAY":
          targetWs.send(
            JSON.stringify({
              type: MESSAGE_TYPES.HANDLE_SONG_PLAY
            })
          );
          break;
        case "PLAY_SONG":
          targetWs.send(
            JSON.stringify({
              type: MESSAGE_TYPES.PLAY_SONG,
              payload: {
                songId: payload.songId
              }
            })
          );
          break;

        case "SEEK":
          targetWs.send(
            JSON.stringify({
              type: MESSAGE_TYPES.SEEK,
              payload: {
                musicSeekTime: payload.musicSeekTime
              }
            })
          );
          break;
        default:
          console.warn(`Unknown action type: ${action}`);
      }
    }
  }
}

const SyncControllerInstance = new SyncController();

export default SyncControllerInstance;
