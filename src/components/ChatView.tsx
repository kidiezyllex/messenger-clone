"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Conversation, Message } from "../../lib/entity-types";
import { pusherClient } from "@/lib/pusher";
import ChatViewTop from "./chat/ChatViewTop";
import MessageCpn from "./chat/MessageCpn";
import ChatViewBottom from "./chat/ChatViewBottom";

export function ChatView({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    if (conversationId !== "new-account") {
      try {
        const res = await axios.get(`/api/conversations/${conversationId}`);
        setConversation(res.data);
        setMessages(res.data.messages);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching conversation data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [conversationId]);

  useEffect(() => {
    if (!pusherInitialized.current) {
      pusherClient.subscribe(conversationId);
      pusherClient.bind("message:new", (message: Message) => {
        setMessages((current) => [...current, message]);
        scrollToBottom();
      });
      pusherInitialized.current = true;
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
    <div className="flex h-full flex-1 flex-col flex-grow bg-secondary rounded-xl ml-4 border">
      <ChatViewTop conversation={conversation} />
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <MessageCpn key={message.id} message={message} userId={userId} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ScrollBar orientation="vertical" className="bg-zinc-900" />
      </ScrollArea>
      <ChatViewBottom conversationId={conversationId} userId={userId} />
    </div>
  );
}
