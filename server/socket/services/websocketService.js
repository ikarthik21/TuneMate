import { WebSocketServer } from 'ws';
import { addConnection, removeConnection } from './userConnections.js';
import { handleMessage } from '../controllers/messageHandler.js';
import redisClient from '../config/redisClient.js';

export const startWebSocketServer = (server) => {

    const wss = new WebSocketServer({ server });

    wss.on('connection', async (ws, req) => {
        const params = new URL(req.url, `ws://${req.headers.host}`).searchParams;
        const clientId = params.get('userId');

        if (clientId) await addConnection(clientId, ws);

        ws.on('message', async (message) => {
            const data = JSON.parse(message);
            await handleMessage(ws, data);
        });

        ws.on('close', async () => {
            await removeConnection(clientId);
            const connectedUserId = await redisClient.hget('activeConnections', clientId);
            if (connectedUserId) {
                await redisClient.hdel('activeConnections', clientId);
                await redisClient.hdel('activeConnections', connectedUserId);
            }
        });
    });
};