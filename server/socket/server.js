import {WebSocketServer} from 'ws';
import http from 'http';
import RedisServiceInstance from './utils/socket-utils.js';
import {v4 as uuid_v4} from 'uuid';
import SocketHelperInstance from "./utils/helper.js";

const PORT = process.env.PORT || 4100;
const server = http.createServer();
const wss = new WebSocketServer({server});

wss.on('connection', (ws) => {
    const websocketId = uuid_v4();
    ws.id = websocketId;

    console.log(`New WebSocket connection established with ID: ${websocketId}`);

    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        await RedisServiceInstance.handleMessage(ws, data, websocketId);
    });

    ws.on('close', async () => {
        console.log(`WebSocket connection closed with ID: ${websocketId}`);
        await SocketHelperInstance.handleDisconnection(websocketId);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket server is listening on http://localhost:${PORT}`);
});
