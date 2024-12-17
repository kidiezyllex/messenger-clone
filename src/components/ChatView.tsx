"use client";
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  CirclePlus,
  Image,
  Sticker,
  SmilePlus,
  ThumbsUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Conversation } from "../../lib/entity-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export function ChatView({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = useState<Conversation>();
  const [inputMessage, setInputMessage] = useState("");
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const fetchData = async () => {
    const res = await axios.get(`/api/conversations/${conversationId}`);
    setConversation(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    fetchData();
  }, [conversationId]);

  const handleSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && inputMessage.trim() !== "") {
      try {
        await axios.post(`/api/messages`, {
          conversationId,
          image: "",
          content: inputMessage,
          senderId: userId,
        });
        setInputMessage("");
        fetchData();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col flex-grow bg-secondary rounded-xl ml-4 border">
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
      <ScrollArea className="flex-1 overflow-auto space-y-2 px-3">
        <div className="space-y-4">
          {conversation?.messages?.map((message) => (
            <div
              className={
                message?.senderId === userId
                  ? "flex gap-3 flex-row-reverse"
                  : "flex gap-3"
              }
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message?.sender?.image} />
                <AvatarFallback>{message?.sender?.name}</AvatarFallback>
              </Avatar>
              <div className="rounded-full bg-background dark:bg-zinc-700 py-2 px-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {message?.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className="flex flex-row p-3">
        <div className="flex flex-row">
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <CirclePlus className="h-5 w-5 text-violet-500 " />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <Image className="h-5 w-5 text-violet-500 " />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <Sticker className="h-5 w-5 text-violet-500 " />
          </Button>
        </div>
        <div className="flex gap-2 flex-grow relative">
          <Input
            placeholder="Type a message..."
            className="flex-1 rounded-full"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleSendMessage}
          />
          <SmilePlus className="h-5 w-5 text-violet-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="hover:bg-primary-foreground rounded-full"
        >
          <ThumbsUp className="h-5 w-5 text-violet-500 " />
        </Button>
      </div>
    </div>
  );
}
