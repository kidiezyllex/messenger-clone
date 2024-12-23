"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Conversation, Message, User } from "../../lib/entity-types";
import { pusherClient } from "@/lib/pusher";
import ChatViewTop from "./chat/ChatViewTop";
import MessageCpn from "./chat/MessageCpn";
import ChatViewBottom from "./chat/ChatViewBottom";

export function ChatView({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user2, setUser2] = useState<User>();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherInitialized = useRef(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      const user2 = res.data.users.filter((item: any) => item.id !== userId);
      setConversation(res.data);
      setMessages(res.data.messages);
      setUser2(user2[0]);
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (conversationId !== "new-account" && status === "authenticated") {
      fetchData();
    }
  }, [status]);

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
      <ChatViewTop conversationId={conversation?.id} user2={user2} />
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
