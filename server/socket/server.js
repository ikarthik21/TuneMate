import {startWebSocketServer} from './services/websocketService.js';
import express from 'express';
import router from './routes/routes.js';

const PORT                  = process.env.PORT || 4100;
const  server               = express();

server.use(express.json());
server.use(router);
startWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});