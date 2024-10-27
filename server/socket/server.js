import http from 'http';
import {startWebSocketServer} from './services/websocketService.js';

const PORT                  = process.env.PORT || 4100;
const server                = http.createServer();

startWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});