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
import useStore from "@/store/useStore";
import FileSidebar from "../chat/FileSideBar/FileSideBar";
import Loading from "../animation/Loading";

export function ChatView() {
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user2, setUser2] = useState<User>();
  const [replyMessage, setReplyMessage] = useState<Message>();
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const conversationId = usePathname().split("/")[2];
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const { showFileSideBar, setMember } = useStore();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/conversations/${conversationId}`);
      const user2 = res.data.users.filter((item: any) => item.id !== userId);
      setConversation(res.data);
      setMessages(res.data.messages);
      setUser2(user2[0]);
      if (res.data?.isGroup) setMember(res.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
      pusherClient.subscribe(conversationId);
      pusherClient.bind("message:new", (message: Message) => {
        setMessages((current) => {
          const updatedMessages = [...current, message];
          setTimeout(scrollToBottom, 0);
          return updatedMessages;
        });
        console.log(message);
      });
    }
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new");
    };
  }, [status, conversationId]);

  // useEffect(() => {
  //   if (status === "authenticated" && selectConversationId) {
  //     fetchData();
  //     pusherClient?.subscribe(selectConversationId);
  //     pusherClient?.bind("message:new", (message: Message) => {
  //       setLastMessage(message);
  //       fetchData();
  //     });
  //   }
  //   return () => {
  //     pusherClient.unsubscribe(selectConversationId);
  //     pusherClient.unbind("message:new");
  //   };
  // }, [status, selectConversationId]);
  return (
    <div className="flex gap-4 flex-1">
      <div className="flex h-full flex-col flex-grow bg-secondary rounded-xl ml-4 border">
        {loading ? (
          <Loading></Loading>
        ) : (
          <>
            <ChatViewTop
              conversation={conversation}
              user2={user2}
              setExpanded={setExpanded}
              expanded={expanded}
            />
            {conversation?.pinnedMessages.length !== 0 && (
              <PinnedMessage></PinnedMessage>
            )}
            <ScrollArea className="h-full">
              <div className={`p-4 space-y-4`}>
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
              conversation={conversation}
            />
          </>
        )}
      </div>
      {expanded ? (
        showFileSideBar ? (
          <FileSidebar conversation={conversation}></FileSidebar>
        ) : (
          <ChatSidebar conversation={conversation} user2={user2}></ChatSidebar>
        )
      ) : null}
    </div>
  );
}
