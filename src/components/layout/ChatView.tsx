"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Conversation, Message, User } from "../../../lib/entity-types";
import { pusherClient } from "@/lib/pusher";
import ChatViewTop from "../chat/ChatViewTop";
import MessageCpn from "../chat/Message/page";
import ChatViewBottom from "../chat/ChatViewBottom";
import ChatSidebar from "../chat/ChatSidebar";
import PinnedMessage from "../chat/PinnedMessage/page";
import { usePathname } from "next/navigation";

export function ChatView() {
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user2, setUser2] = useState<User>();
  const [replyMessage, setReplyMessage] = useState<Message>();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherInitialized = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const conversationId = usePathname().split("/")[2];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      const user2 = res.data.users.filter((item: any) => item.id !== userId);
      setConversation(res.data);
      setMessages(res.data.messages);
      setUser2(user2[0]);
      setPinnedMessages(res.data.pinnedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      conversationId !== "" &&
      conversationId !== "new-account" &&
      status === "authenticated"
    ) {
      fetchData().then(() => {
        setTimeout(scrollToBottom, 0);
      });
    }
  }, [status, conversationId]);

  useEffect(() => {
    if (!pusherInitialized.current) {
      pusherClient.subscribe(conversationId);
      pusherClient.bind("message:new", (message: Message) => {
        setMessages((current) => {
          const updatedMessages = [...current, message];
          setTimeout(scrollToBottom, 0);
          return updatedMessages;
        });
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
    <div className="flex gap-4 flex-1">
      <div className="flex h-full flex-col flex-grow bg-secondary rounded-xl ml-4 border">
        <ChatViewTop
          conversation={conversation}
          user2={user2}
          setExpanded={setExpanded}
          expanded={expanded}
        />
        {pinnedMessages[pinnedMessages.length - 1] && (
          <PinnedMessage
            message={pinnedMessages[pinnedMessages.length - 1]}
          ></PinnedMessage>
        )}
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
          conversationId={conversationId}
          userId={userId}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}

        />
      </div>
      {expanded && (
        <ChatSidebar conversation={conversation} user2={user2}></ChatSidebar>
      )}
    </div>
  );
}
