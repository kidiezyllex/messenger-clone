"use client";
import { SearchIcon, UserRoundPlus, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Conversation, User } from "../../lib/entity-types";
import { useSession } from "next-auth/react";
import { ConversationItem } from "./conversation/ConversationItem";

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (status === "authenticated") {
      const fecthData = async () => {
        const res = await axios.get(`/api/conversations/user/${userId}`);
        setConversations(res.data);
      };
      fecthData();
    }
  }, [status]);
  return (
    <div className="flex flex-col h-full w-96 p-2 py-4 bg-secondary rounded-xl gap-3 border">
      <div className="flex flex-col mx-2 gap-2">
        <h1 className="text-xl font-bold text-zinc-600 dark:text-zinc-300">
          Đoạn chat
        </h1>
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="relative rounded-full flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm trên Messenger"
              className="pl-8 dark:bg-primary-foreground"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="dark:bg-primary-foreground dark:hover:bg-background"
          >
            <UserRoundPlus className="h-4 w-4"></UserRoundPlus>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="dark:bg-primary-foreground dark:hover:bg-background"
          >
            <UsersRound className="h-4 w-4"></UsersRound>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 space-y-2 px-2">
        {conversations.map((conversation, index) => (
          <ConversationItem conversation={conversation} key={index} />
        ))}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
