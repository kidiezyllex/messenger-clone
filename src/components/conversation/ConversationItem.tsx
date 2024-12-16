"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate2 } from "../../../lib/utils";
import { Conversation } from "../../../lib/entity-types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  EllipsisVertical,
  MailCheck,
  BellRing,
  PhoneCall,
  Video,
} from "lucide-react";
export function ConversationItem({
  conversation,
}: {
  conversation: Conversation;
}) {
  return (
    <div
      key={conversation.id}
      className="flex items-center gap-3 p-4 hover:bg-zinc-700 rounded-md pointer-events-auto"
    >
      <Avatar className="w-12 h-12 bg-background">
        <AvatarImage src={conversation?.users[1]?.image} />
        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{conversation.name}</p>
          <span className="text-xs text-muted-foreground">
            {/* {conversation.seenMessages} */}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {formatDate2(conversation?.lastMessageAt)}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="h-8 w-8 rounded-full hover:bg-background pointer-events-auto flex flex-row justify-center items-center">
            <EllipsisVertical className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-zinc-900">
          <DropdownMenuItem className="p-2">
            <MailCheck className="h-4 w-4" />
            <span className="font-semibold text-sm">Đánh dấu là đã đọc</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2">
            <BellRing className="h-4 w-4" />
            <span className="font-semibold text-sm">Bật thông báo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem className="p-2">
            <PhoneCall className="h-4 w-4" />
            <span className="font-semibold text-sm">Gọi thoại</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2">
            <Video className="h-4 w-4" />
            <span className="font-semibold text-sm">Chat video</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
