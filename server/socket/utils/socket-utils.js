import SocketHelperInstance from "./helper.js";

class RedisService {
    async handleMessage(ws, data, websocketId) {
        try {
            switch (data.action) {
                case 'USER_INIT':
                    await SocketHelperInstance.setConnection(data.userId, websocketId);
                    SocketHelperInstance.wsConnections.set(websocketId, ws);
                    break;
                case 'USER_DE_INIT':
                    await SocketHelperInstance.handleDisconnection(websocketId);
                    SocketHelperInstance.wsConnections.delete(websocketId);
                    break;
                case 'SEND_REQUEST':
                    await SocketHelperInstance.sendConnectionRequest(data.payload.userId, data.payload.targetUserId);
                    break;
                case 'ACCEPT_REQUEST':
                    await SocketHelperInstance.acceptRequest(data.payload.userId, data.payload.fromUserId);
                    break;
                case 'DECLINE_REQUEST':
                    await SocketHelperInstance.declineRequest(data.payload.userId, data.payload.fromUserId);
                    break;
                case 'LEAVE_ROOM':
                    await SocketHelperInstance.leaveRoom(data.roomId, websocketId);
                    break;
                case 'MUSIC_UPDATE':
                    await SocketHelperInstance.musicUpdate(data.payload.userId, data.payload.fromUserId ,data.payload.songId)
                    break;
                default:
                    console.log('Unknown action:', data.action);
                    break;
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    }
}

const RedisServiceInstance = new RedisService();
export default RedisServiceInstance;
