import Redis from "ioredis";

class SocketHelper {
    constructor() {
        const redisUrl = process.env.REDIS_URL || 'http://localhost:6379';

        this.redisClient = new Redis(redisUrl);
        this.wsConnections = new Map();
        this.redisClient.on('connect', () => {
            console.log('Successfully connected to Redis');
        });

        this.redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        this.redisClient.on('end', () => {
            console.log('Redis connection closed');
        });

        this.redisClient.on('reconnecting', (time) => {
            console.log(`Reconnecting to Redis in ${time} ms`);
        });

        this.redisClient.on('ready', () => {
            console.log('Redis client is ready to use');
        });


    }

    async setConnection(userId, wsId) {
        try {
            await this.redisClient.hset('userConnections', userId, wsId);
            await this.redisClient.set(`websocket:${wsId}`, userId);
            this.wsConnections.set(wsId, null);
        } catch (err) {
            console.error('Set connection error:', err);
            throw err;
        }
    }

    async getConnection(userId) {
        try {
            return await this.redisClient.hget('userConnections', userId);
        } catch (err) {
            console.error('Get connection error:', err);
            throw err;
        }
    }

    async joinRoom(roomId, websocketId) {

        try {
            await this.redisClient.sadd(roomId, websocketId);
        } catch (err) {
            console.error('Join room error:', err);
            throw err;
        }
    }

    async leaveRoom(roomId, websocketId) {
        try {
            await this.redisClient.srem(`room:${roomId}`, websocketId);
        } catch (err) {
            console.error('Leave room error:', err);
            throw err;
        }
    }

    async handleDisconnection(websocketId) {
        try {
            const userId = await this.redisClient.get(`websocket:${websocketId}`);
            if (userId) {
                await this.redisClient.hdel('userConnections', userId);
                await this.redisClient.del(`websocket:${websocketId}`);

                const rooms = await this.redisClient.keys('room:*');
                for (const room of rooms) {
                    await this.redisClient.srem(room, websocketId);
                }
                this.wsConnections.delete(websocketId);
            }
        } catch (err) {
            console.error('Handle disconnection error:', err);
            throw err;
        }
    }

    async getRoomUsers(roomId) {
        try {
            return await this.redisClient.smembers(roomId);
        } catch (err) {
            console.error('Get room users error:', err);
            throw err;
        }
    }

    async sendConnectionRequest(userId, targetUserId) {
        try {

            const targetWsId = await this.getConnection(targetUserId);
            if (targetWsId) {
                const targetWs = this.getWebSocketById(targetWsId);
                if (targetWs) {

                    targetWs.send(JSON.stringify({
                        action: 'RECEIVE_REQUEST', payload: {fromUserId: userId}
                    }));
                }
            }
        } catch (err) {
            console.error('Send connection request error:', err);
            throw err;
        }
    }

    async acceptRequest(userId, fromUserId) {
        try {
            const roomId = `room:${fromUserId}:${userId}`;
            const fromUserWsId = await this.getConnection(fromUserId);
            const userWsId = await this.getConnection(userId);
            await this.joinRoom(roomId, fromUserWsId);
            await this.joinRoom(roomId, userWsId);
            const roomUsers = await this.getRoomUsers(roomId);
            for (const userWsId of roomUsers) {
                const userWs = this.getWebSocketById(userWsId);
                if (userWs) {
                    userWs.send(JSON.stringify({
                        action: 'CONNECTION_ESTABLISHED', payload: {withUserId: fromUserId}
                    }));
                }
            }
        } catch (err) {
            console.error('Accept request error:', err);
            throw err;
        }
    }

    async musicUpdate(userId, fromUserId, songId) {

        const roomId = `room:${fromUserId}:${userId}`;

        const excluded = await this.getConnection(userId);
        const selfUser = this.getWebSocketById(excluded);

        const roomUsers = await this.getRoomUsers(roomId);
        console.log(roomId)
        for (const userWsId of roomUsers) {
            const userWs = this.getWebSocketById(userWsId);
            if (userWs !== selfUser) {
                userWs.send(JSON.stringify({
                    action: 'UPDATED_MUSIC', payload: {songId: songId}
                }));
            }
        }
    }

    async declineRequest(userId, fromUserId) {
        try {
            const fromUserWsId = await this.getConnection(fromUserId);
            const fromUserWs = this.getWebSocketById(fromUserWsId);
            if (fromUserWs) {
                fromUserWs.send(JSON.stringify({
                    action: 'REQUEST_DECLINED', payload: {byUserId: userId}
                }));
            }
        } catch (err) {
            console.error('Decline request error:', err);
            throw err;
        }
    }

    getWebSocketById(id) {
        return this.wsConnections.get(id);
    }
}

const SocketHelperInstance = new SocketHelper();
export default SocketHelperInstance;
