"use client";
import { Search, SearchIcon, UserRoundPlus, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Conversation, User } from "../../lib/entity-types";
import { useSession } from "next-auth/react";
import { formatDate2 } from "../../lib/utils";
import { ConversationItem } from "./conversation/ConversationItem";

const conversations = [
  {
    id: 1,
    name: "Trần Nam",
    lastMessage: "Bạn: tối rồi nói",
    time: "50 phút",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "FDC Fan Doran Club",
    lastMessage: "zin: 1 card 4 con ni",
    time: "1 giờ",
    avatar: "/placeholder.svg",
  },
  // Add more conversations as needed
];

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    const fecthData = async () => {
      const res = await axios.get(`/api/conversations/user/${userId}`);
      setConversations(res.data);
    };
    fecthData();
  }, [userId]);
  return (
    <div className="flex flex-col h-full w-90 p-2 py-4 bg-secondary rounded-xl gap-3 border">
      <div className="flex flex-col mx-2 gap-2">
        <h1 className="text-2xl font-bold text-zinc-600 dark:text-zinc-300">
          Đoạn chat
        </h1>
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="relative rounded-full flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Tìm kiếm trên Messenger" className="pl-8" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="dark:hover:bg-background"
          >
            <UserRoundPlus className="h-4 w-4"></UserRoundPlus>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="dark:hover:bg-background"
          >
            <UsersRound className="h-4 w-4"></UsersRound>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto space-y-2">
        {conversations.map((conversation, index) => (
          <ConversationItem conversation={conversation} key={index} />
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
