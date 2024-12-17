import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import { Conversation } from "../../../lib/entity-types";

export default function ChatViewTop({
  conversation,
}: {
  conversation: Conversation;
}) {
  return (
    <div className="flex items-center justify-between p-3 border-b dark:border-b-zinc-600 border-b-zinc-300">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={conversation?.users[1]?.image} />
          <AvatarFallback>{conversation?.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-zinc-600 dark:text-zinc-300">
            {conversation?.users[1]?.name}
          </h2>
          <p className="text-sm text-muted-foreground">Đang hoạt động</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-violet-500 hover:text-violet-300"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-violet-500 hover:text-violet-300"
        >
          <Video className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-violet-500 hover:text-violet-300"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
