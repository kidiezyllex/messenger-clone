"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import { ChevronDown, Pin } from "lucide-react";
import { Button } from "./ui/button";
import { formatDate2, formatDate3 } from "../../lib/utils";
import PinnedMessage from "./chat/PinnedMessage";

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
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/conversations/${selectConversationId}`);
      const user2 = res.data.users.filter((item: any) => item.id !== userId);
      setConversation(res.data);
      setMessages(res.data.messages);
      setUser2(user2[0]);
      setPinnedMessages(res.data.pinnedMessages);
      console.log(res.data.pinnedMessages);
    } catch (error) {
      console.error(error);
    }
  }, [selectConversationId, userId]);

  useEffect(() => {
    if (
      selectConversationId !== "" &&
      selectConversationId !== "new-account" &&
      status === "authenticated"
    ) {
      fetchData().then(() => {
        setTimeout(scrollToBottom, 0);
      });
    }
  }, [status, selectConversationId, fetchData, scrollToBottom]);

  useEffect(() => {
    if (!pusherInitialized.current) {
      pusherClient.subscribe(selectConversationId);
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
        pusherClient.unsubscribe(selectConversationId);
        pusherClient.unbind("message:new");
        pusherInitialized.current = false;
      }
    };
  }, [selectConversationId, scrollToBottom]);

  return (
    <div className="flex gap-4 flex-1">
      <div className="flex h-full flex-col flex-grow bg-secondary rounded-xl ml-4 border">
        <ChatViewTop
          conversation={conversation}
          user2={user2}
          setExpanded={setExpanded}
          expanded={expanded}
        />
        {pinnedMessages && (
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
