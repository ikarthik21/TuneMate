import { BiSolidCopy } from "react-icons/bi";
import useAuthStore from "@/store/use-auth";
import { MdVerified } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import useWebSocketStore from "@/store/use-socket";
import useUserSyncStore from "@/store/use-userSync";
import { truncateString } from "@/utils/MusicUtils.js";
import { encryptUserId } from "@/utils/MusicUtils.js";
import { Button } from "@/components/ui/button";

const UserSync = () => {
  const { userSyncKey, username, userId } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const { connectId, setConnectId, socket, userDetails, connectionStatus } =
    useWebSocketStore();
  const userSyncRef = useRef(null);
  const { hideUserSync } = useUserSyncStore();

  const handleCopy = async () => {
    setCopied(true);
    const textToCopy = userSyncKey;
    await navigator.clipboard.writeText(textToCopy);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userSyncRef.current && !userSyncRef.current.contains(event.target)) {
        hideUserSync();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideUserSync]);

  const sendConnectionRequest = () => {
    socket.send(
      JSON.stringify({
        type: "CONNECTION_REQUEST",
        payload: {
          connectId,
          senderUsername: username,
          senderId: encryptUserId(userId)
        }
      })
    );
  };

  const closeConnection = () => {
    if (connectionStatus) {
      console.log({
        acceptedBy: { userId: encryptUserId(userId) },
        sentBy: { userId: userDetails.userId }
      });

      socket.send(
        JSON.stringify({
          type: "CLOSE_CONNECTION",
          payload: {
            acceptedBy: { userId: encryptUserId(userId) },
            sentBy: { userId: userDetails.userId }
          }
        })
      );
    }
  };

  if (connectionStatus && userDetails) {
    return (
      <div className="bg-[#18181b] border-[#3b3b3f] px-4 py-2 rounded border absolute  right-2 bottom-12">
        <div className="flex items-center justify-center">
          <h1>Connected with {userDetails.username}</h1>
          <Button
            className="ml-3 mt-1 mb-1 bg-red-500"
            onClick={closeConnection}
          >
            Disonnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#18181b] border-[#3b3b3f] rounded border absolute right-0 bottom-10"
      ref={userSyncRef}
    >
      <div className="flex flex-col p-4">
        <div>
          <h1 className="text-md mb-2">Your Id</h1>
          <div className="flex items-center justify-between  bg-[#3b3b3f] p-2 rounded">
            {/* UserId */}
            <div className="flex items-center justify-center">
              <h2>{truncateString(userSyncKey, 15)}</h2>
            </div>
            {copied ? (
              <MdVerified size={18} color="white" />
            ) : (
              <BiSolidCopy
                size={18}
                color="white"
                cursor={"pointer"}
                onClick={handleCopy}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-md mb-2 mt-4">Connect With</h1>
          <input
            type="text"
            value={connectId || ""}
            className="bg-[#3b3b3f] p-[0.4rem] rounded outline-none border-none"
            onChange={(e) => setConnectId(e.target.value)}
          />
          <button
            className={`mt-4 ${
              connectId ? "button_variant_1" : "button_variant_low"
            }`}
            disabled={!connectId}
            onClick={sendConnectionRequest}
          >
            Connect Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSync;
