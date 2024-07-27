import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useAuth from "@/store/use-auth.js";
import {useEffect, useState} from "react";
import useConnectBoxStore from "@/store/use-connectbox.js";
import useWebSocketStore from "@/store/use-websocket.js";
import Toast from "@/utils/Toasts/Toast.js";
import usePlayerStore from "@/store/use-player.js";

const Connect = () => {
    const {userId} = useAuth();
    const [targetUserId, setTargetUserId] = useState("");
    const {hideConnectBox} = useConnectBoxStore();
    const {setSocket, send, close} = useWebSocketStore();
    const {playSong} = usePlayerStore();
    useEffect(() => {
        if (!userId) return;
        const socket = new WebSocket(import.meta.env.VITE_SOCKET_SERVER_URL);
        setSocket(socket);
        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({action: 'USER_INIT', userId}));
        });

        socket.addEventListener('message', async (message) => {
            const data = JSON.parse(message.data);
            switch (data.action) {
                case "CONNECTION_ESTABLISHED":
                    Toast({type: "success", message: "Connection Successful"});
                    break;
                case "REQUEST_DECLINED":
                    Toast({type: "error", message: "Connection Declined"});
                    break;
                case "UPDATED_MUSIC":
                    await playSong(data.payload.songId)
                    break;
            }

        });

        return () => {
            close();
        };

    }, [userId, setSocket, close]);

    const handleSendRequest = () => {
        send({action: 'SEND_REQUEST', payload: {userId, targetUserId}});
    };

    return (<div className="bg-[#18181b] border-[#2D2E35] border h-52 p-4 z-50 absolute bottom-8">
        <Input
            className="rounded bg-[#222328] h-[35px] w-44 text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
            placeholder="Connect with a user"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
        />
        <div className="flex items-center justify-end mt-2">
            <Button variant="ghost" className="h-8" onClick={hideConnectBox}>
                Cancel
            </Button>
            <Button className="h-8 w-14 button_variant_1 text-black" onClick={handleSendRequest}>
                Connect
            </Button>
        </div>
    </div>);
};

export default Connect;
