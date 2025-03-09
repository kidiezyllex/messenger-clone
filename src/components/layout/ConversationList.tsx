"use client";
import {
  SearchIcon,
  UserRoundPlus,
  UsersRound,
  ArrowLeft,
  MessageCircleMore,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Conversation, Message, User } from "../../../lib/entity-types";
import { useSession } from "next-auth/react";
import { ConversationItem } from "../conversation/ConversationItem";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { CreateGroupDialog } from "../group/CreateGroupDialog";
import useStore from "@/store/useStore";
import { pusherClient } from "@/lib/pusher";
import useMessageStore from "../../../store/useMessageStore";

export function ConversationList() {
  const conversationListRef = useRef<HTMLDivElement>(null);
  const { setSelectConversationId, triggerMessage } = useStore();
  const conversationId = usePathname().split("/")[2];
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<Message>(null);
  const { setNewMessage } = useMessageStore();
  const fetchData = useCallback(async () => {
    if (!userId) return;
    
    try {
      const [conversationsRes, usersRes] = await Promise.all([
        axios.get(`/api/conversations/user/${userId}`),
        axios.get(`/api/users`)
      ]);
      
      setConversations(conversationsRes.data);
      setUsers(usersRes.data.filter((item: User) => item.id !== userId));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId || !conversationId || conversationId === "user-suggested") return;
    
    fetchData();
    
    const handleNewMessage = (message: Message) => {
      setNewMessage(message); // Lưu tin nhắn vào store
      setLastMessage(message); // Cập nhật tin nhắn cuối cùng
      fetchData();
    };
    
    pusherClient.subscribe(conversationId);
    pusherClient.bind("message:new", handleNewMessage);
    
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new", handleNewMessage);
    };
  }, [conversationId, userId, fetchData, triggerMessage]);

  const handleCreateConversation = useCallback(async (user: User) => {
    if (!userId || !user?.id) return;
    
    try {
      const res = await axios.post(`/api/conversations`, {
        userId,
        friendId: user.id,
        name: user.name,
        isGroup: false,
        members: [userId, user.id],
      });
      
      setIsSearchMode(false);
      if (res?.status === 200) {
        router.push(`/t/${res.data.id}`);
      }
    } catch (err) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", err);
    }
  }, [userId, router]);
  
  const filteredUsers = useCallback(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(query)
    );
  }, [users, searchQuery])();
  
  const handleInsideClick = useCallback(async (event: MouseEvent) => {
    if (
      conversationListRef.current &&
      !conversationListRef.current.contains(event.target as Node) &&
      userId
    ) {
      try {
        const res = await axios.get(`/api/conversations/user/${userId}`);
        setLastMessage(res.data[0]?.messages[0]);
        setConversations(res.data);
      } catch (error) {
        console.error("Lỗi khi cập nhật cuộc trò chuyện:", error);
      }
    }
  }, [userId]);

  useEffect(() => {
    document.addEventListener("mouseup", handleInsideClick);
    return () => {
      document.removeEventListener("mouseup", handleInsideClick);
    };
  }, [handleInsideClick]);
  
  const handleNavigateToSuggested = useCallback(() => {
    window.history.pushState(null, "", "/t/user-suggested");
    setSelectConversationId("user-suggested");
  }, [setSelectConversationId]);
  
  const handleExitSearchMode = useCallback(() => {
    setIsSearchMode(false);
    setSearchQuery("");
  }, []);
  
  return (
    <div
      ref={conversationListRef}
      className="flex flex-col h-full 
      w-full
      p-2 py-4 bg-secondary rounded-xl gap-3 border"
    >
      <div className="flex flex-col mx-2 gap-2">
        <h1 className="text-lg font-bold text-zinc-600 dark:text-zinc-300">
          {isSearchMode ? "Tìm kiếm người dùng" : "Đoạn chat"}
        </h1>
        <div className="flex flex-row gap-1 justify-center items-center">
          {isSearchMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExitSearchMode}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative rounded-full flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={
                isSearchMode ? "Tìm kiếm người dùng" : "Tìm kiếm trên Messenger"
              }
              className="dark:bg-primary-foreground pl-9 text-sm"
              onFocus={() => setIsSearchMode(true)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!isSearchMode && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="dark:bg-primary-foreground dark:hover:bg-background flex-shrink-0"
                onClick={handleNavigateToSuggested}
              >
                <UserRoundPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="dark:bg-primary-foreground dark:hover:bg-background flex-shrink-0"
                onClick={() => setIsDialogOpen(true)}
              >
                <UsersRound className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <ScrollArea className="rounded-md">
        <div className="flex flex-col rounded-md px-2 gap-2">
          {isSearchMode
            ? filteredUsers.map((user, index) => (
                <div
                  key={user.id || index}
                  className="flex items-center gap-3 p-4 rounded-md dark:hover:bg-zinc-700"
                >
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
                      {user?.name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm flex-grow">{user?.name}</p>
                  <Button
                    onClick={() => handleCreateConversation(user)}
                    className="flex flex-row gap-2 bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary"
                  >
                    Nhắn tin
                    <MessageCircleMore className="h-4 w-4" />
                  </Button>
                </div>
              ))
            : conversations.map((conversation, index) => (
                <ConversationItem
                  conversation={conversation}
                  index={index}
                  key={conversation.id || index}
                  lastMessage={lastMessage}
                />
              ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <CreateGroupDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
