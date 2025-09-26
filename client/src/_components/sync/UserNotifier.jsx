import useAuthStore from "@/store/use-auth";
import useWebSocketStore from "@/store/use-socket";
import useNotifierStore from "@/store/use-Notifier";
import useUserSyncStore from "@/store/use-userSync";
import tuneMateInstance from "@/service/api/api";
const UserNotifier = () => {
  const { socket, userDetails, setConnectionStatus, connectionStatus } =
    useWebSocketStore();
  const { userId, username } = useAuthStore();
  const { hideNotifier } = useNotifierStore();
  const { showUserSync } = useUserSyncStore();

  const acceptRequest = async (e) => {
    try {
      e.stopPropagation();
      setConnectionStatus(true);
      const payload = {
        acceptedBy: { username, userId: userId },
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

  const declineRequest = (e) => {
    try {
      e.stopPropagation();

      socket.send(
        JSON.stringify({
          type: "CONNECTION_DECLINED",
          payload: {
            sentBy: {
              userId: userDetails.userId,
              username: userDetails.username
            }
          }
        })
      );
      hideNotifier();
    } catch (error) {
      console.error("Error declining request:", error);
      Toast({
        type: "error",
        message: "Failed to decline connection. Please try again."
      });
    }
  };

  return (
    <>
      {userDetails && (
        <div className="bg-[#18181b] p-4 border-[#3b3b3f] rounded border absolute right-2 bottom-16  w-full md:w-64 left-0 md:left-[-100px]">
          <div className="flex flex-col items-center">
            <h2>
              Incoming Connection Request from{" "}
              <span className="text-cyan-500 text-lg">
                {userDetails.username}
              </span>
            </h2>
            <div className="flex items-center space-x-4 mt-4">
              <button
                className="bg-green-400 p-1 rounded"
                onClick={acceptRequest}
                aria-label="Accept connection request"
              >
                Accept
              </button>
              <button
                className="bg-red-400 p-1 rounded"
                onClick={declineRequest}
                aria-label="Decline connection request"
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
