"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchIcon, Send } from "lucide-react";
import { Conversation, Message, User } from "../../../lib/entity-types";
import axios from "axios";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Loading from "../animation/Loading";
import { ConversationItem } from "../conversation/ConversationItem";
import { Button } from "../ui/button";

export function ForwardDialog({ message }: { message: Message }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        const res = await axios.get(`/api/conversations/user/${userId}`);
        const filterConversation = res.data.filter(
          (conversation: any) => conversation?.id !== message?.conversationId
        );
        setConversations(filterConversation);
      };
      fetchData();
    }
  }, [status, userId]);

  const filteredConversations = conversations.filter((conversations) =>
    conversations.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DialogContent className="max-w-[1000px] w-[95%] h-[90%] overflow-y-auto flex flex-col gap-4">
      <DialogTitle className="h-fit pb-2 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300">
        Chuyển tiếp
      </DialogTitle>
      <div className="flex flex-col space-y-4 mr-4">
        <div className="relative rounded-full flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Nhập tên, email"
            className="dark:bg-primary-foreground pl-9 text-sm rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className={"rounded-md"}>
          {loading ? (
            <Loading />
          ) : (
            filteredConversations.map((conversation, index) => (
              <div
                className="flex flex-row gap-4 w-full items-center justify-between"
                key={conversation?.id + index}
              >
                <ConversationItem
                  conversation={conversation}
                ></ConversationItem>
                <Button className="flex flex-row gap-2 bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary">
                  Gửi <Send className="h-4 w-4 ml-2"></Send>
                </Button>
              </div>
            ))
          )}
          <ScrollBar
            orientation="vertical"
            className="dark:bg-primary-foreground bg-secondary"
          />
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
