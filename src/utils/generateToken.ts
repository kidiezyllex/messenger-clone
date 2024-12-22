import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export function generateToken(userId: string, roomId: string) {
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0");
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
  const effectiveTimeInSeconds = "3600"; // 1 hour

  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomId,
    userId,
    effectiveTimeInSeconds
  );
}
