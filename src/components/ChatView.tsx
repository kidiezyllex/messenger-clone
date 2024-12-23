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
import ChatSidebar from "./chat/ChatSidebar";
import useStore from "@/store/useStore";

export function ChatView() {
  const { selectConversationId } = useStore();
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user2, setUser2] = useState<User>();
  const [replyMessage, setReplyMessage] = useState<Message>();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherInitialized = useRef(false);
  const [expanded, setExpanded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/conversations/${selectConversationId}`);
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
    if (
      selectConversationId !== "" &&
      selectConversationId !== "new-account" &&
      status === "authenticated"
    ) {
      fetchData();
    }
  }, [status, selectConversationId]);

  useEffect(() => {
    if (!pusherInitialized.current) {
      pusherClient.subscribe(selectConversationId);
      pusherClient.bind("message:new", (message: Message) => {
        setMessages((current) => [...current, message]);
        scrollToBottom();
      });
      pusherInitialized.current = true;
    }

    return () => {
      if (pusherInitialized.current) {
        pusherClient.unsubscribe(selectConversationId);
        pusherClient.unbind("message:new");
        pusherInitialized.current = false;
      }
    };
  }, [selectConversationId]);

  return (
    <div className="flex gap-4 flex-1">
      <div className="flex h-full flex-col flex-grow bg-secondary rounded-xl ml-4 border">
        <ChatViewTop
          conversation={conversation}
          user2={user2}
          setExpanded={setExpanded}
          expanded={expanded}
        />
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <MessageCpn
                key={message.id}
                message={message}
                userId={userId}
                setReplyMessage={setReplyMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <ScrollBar
            orientation="vertical"
            className="dark:bg-primary-foreground bg-secondary"
          />
        </ScrollArea>
        <ChatViewBottom
          conversationId={selectConversationId}
          userId={userId}
          replyMessage={replyMessage}
        />
      </div>
      {expanded && (
        <ChatSidebar conversation={conversation} user2={user2}></ChatSidebar>
      )}
    </div>
  );
}
