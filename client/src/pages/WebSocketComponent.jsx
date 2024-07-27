import { useEffect, useState } from 'react';
import Wrapper from "@/pages/Wrapper.jsx";
import useAuth from "@/store/use-auth.js";

const WebSocketComponent = () => {
    const [ws, setWs] = useState(null);
    const [status, setStatus] = useState('Disconnected');
    const [targetUserId, setTargetUserId] = useState('');
    const [incomingRequests, setIncomingRequests] = useState([]); // State to manage incoming requests
    const { userId } = useAuth();

    useEffect(() => {
        if (!userId) return;

        const socket = new WebSocket('ws://localhost:4001');

        socket.addEventListener('open', () => {
            setStatus('Connected');
            socket.send(JSON.stringify({ action: 'USER_INIT', payload: { userId } }));
        });

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            const { action, payload } = data;

            switch (action) {
                case 'RECEIVE_REQUEST':
                    setIncomingRequests((prevRequests) => [
                        ...prevRequests,
                        { requestId: payload.requestId, fromUserId: payload.fromUserId }
                    ]);
                    break;

                case 'REQUEST_ACCEPTED':
                    console.log(`Connection request ${payload.fromUserId ? `from ${payload.fromUserId}` : `to ${payload.toUserId}`} accepted`);
                    // Update UI or state if needed
                    break;

                default:
                    console.error('Unknown action:', action);
            }
        });

        socket.addEventListener('close', () => {
            setStatus('Disconnected');
        });

        setWs(socket);

        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ action: 'USER_DE_INIT', payload: { userId } }));
                socket.close();
            }
        };
    }, [userId]);

    const sendRequest = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'SEND_REQUEST', payload: { userId, targetUserId } }));
        }
    };

    const acceptRequest = (requestId, fromUserId) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'ACCEPT_REQUEST', payload: { userId, requestId, fromUserId } }));
        }
        setIncomingRequests((prevRequests) => prevRequests.filter(req => req.requestId !== requestId));
    };

    const declineRequest = (requestId) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'DECLINE_REQUEST', payload: { userId, requestId } }));
        }
        setIncomingRequests((prevRequests) => prevRequests.filter(req => req.requestId !== requestId));
    };

    return (
        <Wrapper>
            <h1>WebSocket Client</h1>
            <p>Status: {status}</p>
            <input
                type="text"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="Enter user ID to connect" className={"text-black"}
            />
            <button onClick={sendRequest}>Send Connection Request</button>

            <div>
                <h2>Incoming Connection Requests</h2>
                {incomingRequests.length === 0 ? (
                    <p>No new requests</p>
                ) : (
                    <ul>
                        {incomingRequests.map((request) => (
                            <li key={request.requestId}>
                                <p>Connection request from user: {request.fromUserId}</p>
                                <button onClick={() => acceptRequest(request.requestId, request.fromUserId)}>Accept</button>
                                <button onClick={() => declineRequest(request.requestId)}>Decline</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Wrapper>
    );
};

export default WebSocketComponent;
