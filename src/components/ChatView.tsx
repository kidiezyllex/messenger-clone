"use client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Conversation, Message } from "../../lib/entity-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import ChatViewTop from "./chat/ChatViewTop";
import MessageCpn from "./chat/MessageCpn";
import ChatViewBottom from "./chat/ChatViewBottom";

export function ChatView({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const fetchData = async () => {
    if (conversationId !== "new-account") {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      setConversation(res.data);
      setMessages(res.data.messages);
    }
  };

  useEffect(() => {
    fetchData();

    pusherClient.subscribe(conversationId);
    pusherClient.bind("message:new", (message: Message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new");
    };
  }, [conversationId]);

  return (
    <div
      className={
        conversationId === "new-account"
          ? "hidden"
          : "flex h-full flex-1 flex-col flex-grow bg-secondary rounded-xl ml-4 border"
      }
    >
      <ChatViewTop conversation={conversation}></ChatViewTop>
      <ScrollArea className="flex-1 overflow-auto space-y-2 px-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageCpn
              key={message.id}
              message={message}
              userId={userId}
            ></MessageCpn>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <ChatViewBottom
        conversationId={conversationId}
        userId={userId}
      ></ChatViewBottom>
    </div>
  );
}
