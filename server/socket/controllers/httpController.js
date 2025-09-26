import redisClient from "../config/redisClient.js";

export const HttpController = () => {
  return {
    async addConnectioninRedis(req, res) {
      try {
        const { connectedUserId, userId } = req.body;
        const decryptedUserId = connectedUserId;
        // Store the active connection in Redis
        await redisClient.hset("activeConnections", decryptedUserId, userId);
        await redisClient.hset("activeConnections", userId, decryptedUserId);
      } catch (err) {
        return err;
      }
    }
  };
};
