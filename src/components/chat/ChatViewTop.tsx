import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import { Conversation, User } from "../../../lib/entity-types";
import VideoCall from "../VideoCall";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function ChatViewTop({
  conversationId,
  user2,
}: {
  conversationId: string;
  user2: User;
}) {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const toggleVideoCall = () => {
    setIsVideoCallActive(!isVideoCallActive);
  };
  return (
    <>
      <div className="flex items-center justify-between p-3 border-b dark:border-b-zinc-700 border-b-zinc-300">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user2?.image} />
            <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
              {user2?.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-zinc-600 dark:text-zinc-300">
              {user2?.name}
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
            onClick={toggleVideoCall}
          >
            <Video className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-500 hover:text-blue-300"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Dialog open={isVideoCallActive} onOpenChange={toggleVideoCall}>
        <DialogTitle></DialogTitle>
        <DialogContent
          className="max-w-[90vw] w-[100%] h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "#1C1F2E" }}
        >
          <VideoCall
            roomId={conversationId}
            userId={user2?.id}
            userName={user2?.name}
            onClose={toggleVideoCall}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
