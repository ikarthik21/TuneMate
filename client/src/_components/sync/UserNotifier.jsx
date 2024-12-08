import useAuthStore from "@/store/use-auth";
import useWebSocketStore from "@/store/use-socket";
import useNotifierStore from "@/store/use-Notifier";
import { encryptUserId } from "@/utils/MusicUtils";
import useUserSyncStore from "@/store/use-userSync";
import tuneMateInstance from "@/service/api/api";
const UserNotifier = () => {
  const { socket, userDetails, setConnectionStatus, connectionStatus } =
    useWebSocketStore();
  const { userId, username } = useAuthStore();
  const { hideNotifier } = useNotifierStore();
  const { showUserSync } = useUserSyncStore();

  const acceptRequest = async () => {
    try {
      setConnectionStatus(true);
      const payload = {
        acceptedBy: { username, userId: encryptUserId(userId) },
        sentBy: {
          userId: userDetails.userId,
          username: userDetails.username
        }
      };

      socket.send(
        JSON.stringify({
          type: "CONNECTION_ACCEPTED",
          payload: payload
        })
      );

      // Update sync state in the backend
      await tuneMateInstance.updateSyncState({
        userId: userDetails.userId,
        username: userDetails.username
      });

      hideNotifier();
      showUserSync();
    } catch (error) {
      console.error("Error accepting request:", error);
      Toast({
        type: "error",
        message: "Failed to accept connection. Please try again."
      });
    }
  };

  const declineRequest = () => {
    socket.send(
      JSON.stringify({
        type: "CONNECTION_DECLINED",
        payload: {
          sentBy: {
            userId: userDetails.senderId,
            username: userDetails.username
          }
        }
      })
    );
    hideNotifier();
  };

  return (
    <>
      {userDetails && (
        <div className="bg-[#18181b] p-4 border-[#3b3b3f] rounded border absolute right-2 bottom-10 ">
          <div className="flex flex-col items-center">
            <h2>Incoming Connection Request from</h2>
            <h2>{userDetails.username}</h2>
            <div className="flex items-center space-x-4 mt-4">
              <button
                className="bg-green-400 p-1 rounded"
                onClick={acceptRequest}
              >
                Accept
              </button>
              <button
                className="bg-red-400 p-1 rounded"
                onClick={declineRequest}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNotifier;
