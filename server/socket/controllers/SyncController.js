import MESSAGE_TYPES from "../utils/messageTypes.js";
import { getWebSocketByUserId } from "../services/userConnections.js";
import redisClient from "../config/redisClient.js";

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

    // Send the connection request message
    targetWs.send(
      JSON.stringify({
        type: MESSAGE_TYPES.CONNECTION_REQUEST,
        payload: { username, senderId }
      })
    );
  }

  async acceptConnectionRequest(payload) {
    const { acceptedBy, sentBy } = payload;

    // Store the active connection in Redis
    await redisClient.hset(
      "activeConnections",
      sentBy.userId,
      acceptedBy.userId
    );
    await redisClient.hset(
      "activeConnections",
      acceptedBy.userId,
      sentBy.userId
    );

    const targetWs = await this.getValidWebSocket(sentBy.userId);
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
    const { declinedBy } = payload;
    const targetWs = await this.getValidWebSocket(declinedBy.userId);
    if (!targetWs) return;

    // Send the connection declined message
    targetWs.send(
      JSON.stringify({
        type: MESSAGE_TYPES.CONNECTION_DECLINED,
        payload: { declinedBy: declinedBy.username }
      })
    );
  }

  async syncAction(payload) {
    console.log(payload);

    const { senderId, action, songId, time } = payload;

    const targetUserId = await redisClient.hget("activeConnections", senderId);
    if (!targetUserId) {
      console.warn(`No active connection found for userId: ${senderId}`);
      return;
    }
    const targetWs = await getWebSocketByUserId(targetUserId);
    if (targetWs) {
      targetWs.send(
        JSON.stringify({ type: action, payload: { songId, time } })
      );
    }
  }
}

const SyncControllerInstance = new SyncController();

export default SyncControllerInstance;
