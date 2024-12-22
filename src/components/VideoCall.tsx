import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuid } from "uuid";
interface VideoCallProps {
  roomId: string;
  userId: string;
  userName: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, userName }) => {
  const callContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async () => {
      // Generate Kit Token
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0", 10);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        uuid(),
        userName,
        720
      );

      // Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Start the call
      if (callContainerRef.current) {
        zp.joinRoom({
          container: callContainerRef.current,
          sharedLinks: [
            {
              name: "Public link",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomId,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
        });
      }
    };

    myMeeting();
  }, [roomId, userName]);

  return (
    <div
      className="myCallContainer w-[100%] h-[100%] bg-background"
      ref={callContainerRef}
    ></div>
  );
};

export default VideoCall;
