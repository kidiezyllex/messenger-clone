import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import { Conversation, Message, User } from "../../../lib/entity-types";
import VideoCall from "./VideoCall";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { pusherClient } from "@/lib/pusher";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function ChatViewTop({
  conversation,
  user2,
  setExpanded,
  expanded,
}: {
  conversation: Conversation;
  user2: User;
  setExpanded: (expanded: boolean) => void;
  expanded: boolean;
}) {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const pathname = usePathname();
  const conversationId = pathname.split("/")[2];
  const { data: session } = useSession();
  const pusherInitialized = useRef(false);

  const toggleVideoCall = () => {
    setIsVideoCallActive(!isVideoCallActive);
  };

  const initiateVideoCall = async () => {
    try {
      await axios.post(`/api/messages`, {
        conversationId,
        image: "",
        file: "",
        content: "",
        senderId: (session?.user as any)?.id,
        type: "call",
        replyMessageId: "",
        replyText: "",
      });
      toggleVideoCall();
    } catch (error) {
      console.error("Error initiating video call:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      pusherClient.subscribe(conversationId);
      pusherClient.bind("message:new", (message: Message) => {
        if (message?.conversationId === conversationId) {
          toggleVideoCall();
        }
      });
    }
    return () => {
      if (pusherInitialized.current) {
        pusherClient.unsubscribe(conversationId);
        pusherClient.unbind("message:new");
        pusherInitialized.current = false;
      }
    };
  }, [conversationId]);
  return (
    <>
      {conversation?.name || user2?.name ? (
        <div className="flex items-center justify-between p-3 border-b dark:border-b-zinc-700 border-b-zinc-300">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={
                  conversation?.isGroup
                    ? conversation?.groupImage
                    : user2?.image
                }
              />
              <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
                {conversation?.isGroup
                  ? conversation?.name?.[0]
                  : user2?.name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-zinc-600 dark:text-zinc-300">
                {conversation?.isGroup
                  ? `Nhóm: ${conversation?.name}`
                  : user2?.name}
              </h2>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-500 hover:text-blue-300"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-500 hover:text-blue-300"
              onClick={initiateVideoCall}
            >
              <Video className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`text-blue-500 hover:text-blue-300 rounded-full hover:bg-primary-foreground ${
                expanded ? "bg-primary-foreground" : "bg-transparent"
              }`}
              onClick={() => setExpanded(!expanded)}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : null}
      <Dialog open={isVideoCallActive} onOpenChange={toggleVideoCall}>
        <DialogTitle></DialogTitle>
        <DialogContent
          className="max-w-[90vw] w-[100%] h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "#1C1F2E" }}
        >
          <VideoCall
            roomId={conversation?.id || ""}
            userId={(session?.user as any)?.id}
            userName={(session?.user as any)?.name}
            onClose={toggleVideoCall}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
