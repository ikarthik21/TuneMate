import useWebSocketStore from "@/store/use-websocket.js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/use-auth.js";

const ConnectorDialog = () => {
    const { socket, setTargetUserId, send } = useWebSocketStore();
    const { userId } = useAuthStore();
    const [data, setData] = useState();

    useEffect(() => {
        const handleMessage = (message) => {
            const data = JSON.parse(message.data);
            setData(data);
            if (data.payload?.fromUserId) {
                setTargetUserId(data.payload.fromUserId);
            }
        };

        if (socket) {
            socket.addEventListener("message", handleMessage);
        }

        return () => {
            if (socket) {
                socket.removeEventListener("message", handleMessage);
            }
        };
    }, [socket, setTargetUserId]);

    const acceptRequest = () => {
        if (data?.payload?.fromUserId) {
            send({ action: "ACCEPT_REQUEST", payload: { userId, fromUserId: data.payload.fromUserId } });
        }
    };

    const declineRequest = () => {
        if (data?.payload?.fromUserId) {
            send({ action: "DECLINE_REQUEST", payload: { fromUserId: userId, userId: data.payload.fromUserId } });
        }
    };

    return (
        <>
            {data?.payload?.fromUserId && (
                <div className="bg-[#18181b] border-[#2D2E35] border flex flex-col w-96 p-4 z-50 fixed top-20 right-2">
                    <h1>Request from {data?.payload?.fromUserId || "Unknown User"}</h1>
                    <div className="flex items-center justify-center mt-8">
                        <Button className="bg-green-700 mr-2" onClick={acceptRequest}>
                            Accept
                        </Button>
                        <Button className="bg-red-600" onClick={declineRequest}>
                            Decline
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConnectorDialog;
