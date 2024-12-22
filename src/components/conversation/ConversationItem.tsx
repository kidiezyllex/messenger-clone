"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate2, getLastName } from "../../../lib/utils";
import { Conversation, Message } from "../../../lib/entity-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  MailCheck,
  BellRing,
  PhoneCall,
  Video,
  Ban,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
export function ConversationItem({
  conversation,
}: {
  conversation: Conversation;
}) {
  const router = useRouter();
  const pathName = usePathname().split("/")[2];
  const [messages, setMessages] = useState<Message>();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const fetchData = async () => {
    if (conversation?.id !== "new-account") {
      const res = await axios.get(`/api/conversations/${conversation?.id}`);
      setMessages(res.data.messages[res.data.messages.length - 1]);
    }
  };

  useEffect(() => {
    fetchData();
    pusherClient.subscribe(conversation?.id);
    pusherClient.bind("message:new", (message: Message) => {
      setMessages(message);
    });
  }, [conversation?.id]);

  const renderLatestMessage = () => {
    if (messages?.senderId === userId) {
      if (messages?.image) return "Bạn: Đã gửi 1 ảnh";
      else return `Bạn: ${messages?.text}`;
    } else {
      if (messages?.image)
        return `${getLastName(messages?.sender?.name)}: Đã gửi 1 ảnh`;
      else return `${getLastName(messages?.sender?.name)}: ${messages?.text}`;
    }
  };
  return (
    <div
      onClick={() => router.push(`/t/${conversation.id}`)}
      key={conversation.id}
      className={
        pathName === conversation.id
          ? "dark:bg-zinc-700 dark:hover:bg-zinc-700 bg-background border flex items-center gap-3 p-4 rounded-lg cursor-pointer"
          : "dark:hover:bg-zinc-700 flex items-center gap-3 p-4 rounded-lg cursor-pointer"
      }
    >
      <Avatar className="w-11 h-11">
        <AvatarImage src={conversation?.users[1]?.image} />
        <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
          {conversation.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{conversation.name}</p>
          <span className="text-xs text-muted-foreground">
            {/* {conversation.seenMessages} */}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground italic">
          {renderLatestMessage()}
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
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-2">
            <BellRing className="h-4 w-4" />
            <span className="font-semibold text-sm">Bật thông báo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-2">
            <PhoneCall className="h-4 w-4" />
            <span className="font-semibold text-sm">Gọi thoại</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-2">
            <Video className="h-4 w-4" />
            <span className="font-semibold text-sm">Chat video</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-2">
            <Ban className="h-4 w-4" />
            <span className="font-semibold text-sm">Chặn người dùng</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
