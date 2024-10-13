import redisClient from '../config/redisClient.js';

// In-memory map to hold active WebSocket connections
const wsConnections = new Map();

// Add a user connection (store userId -> wsId mapping in Redis)
export const addConnection = async (userId, ws) => {
    const wsId = generateWsId();
    wsConnections.set(wsId, ws);
    await redisClient.hset('user:wsid', userId, wsId);
    return wsId;
};

// Remove user connection when they disconnect
export const removeConnection = async (userId) => {
    const wsId = await redisClient.hget('user:wsid', userId);
    if (wsId) {
        wsConnections.delete(wsId);
        await redisClient.hdel('user:wsid', userId);
    } else {
        console.warn(`No connection found for userId: ${userId}`);
    }
};

// Retrieve WebSocket by userId
export const getWebSocketByUserId = async (userId) => {
    const wsId = await redisClient.hget('user:wsid', userId);
    if (!wsId) {
        console.warn(`No WebSocket ID found for userId: ${userId}`);
        return null;
    }
    const ws = wsConnections.get(wsId);
    if (!ws) {
        console.warn(`No active WebSocket found for wsId: ${wsId}`);
    }
    return ws;
};

// Generate a unique WebSocket ID
const generateWsId = () => `ws_${Math.random().toString(36).substr(2, 9)}`;

