import {WebSocketServer} from 'ws';
import {createClient} from 'redis';

const wss = new WebSocketServer({port: 8080});
const redisClient = createClient();

await redisClient.connect().then(() => {
    console.log('Connected to Redis successfully');
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
    process.exit(1);
});

wss.on('connection', (ws) => {
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


console.log('WebSocket server is running on ws://localhost:8080');
