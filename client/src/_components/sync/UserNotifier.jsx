/* eslint-disable react/prop-types */
import useAuthStore from "@/store/use-auth";
import useWebSocketStore from "@/store/use-socket";
import useNotifierStore from "@/store/use-Notifier";

const UserNotifier = ({ data }) => {
    const { socket } = useWebSocketStore();
    const { userId, username } = useAuthStore();
    const { hideNotifier } = useNotifierStore();


    const acceptRequest = () => {
        socket.send(JSON.stringify({ type: "CONNECTION_ACCEPTED", payload: { acceptedBy: { username, userId }, sentBy: { userId: data.senderId, useranme: data.username } } }));
        hideNotifier();
    }


    const declineRequest = () => {
        socket.send(JSON.stringify({ type: "CONNECTION_DECLINED", payload: { declinedBy: { username, userId } } }));
        hideNotifier();
    }


    return (
        <>
            {data && <div className="bg-[#18181b] p-4 border-[#3b3b3f] rounded border absolute right-2 bottom-10 ">
                <div className="flex flex-col items-center">
                    <h2>Incoming Connection Request from</h2>
                    <h2>{data?.username}</h2>
                    <div className="flex items-center space-x-4 mt-4">
                        <button className="bg-green-400 p-1 rounded" onClick={acceptRequest}>Accept</button>
                        <button className="bg-red-400 p-1 rounded" onClick={declineRequest}>Decline</button>
                    </div>
                </div>

            </div>}
        </>


    );
}

export default UserNotifier