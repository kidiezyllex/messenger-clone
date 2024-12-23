"use client";
import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ChatView } from "@/components/ChatView";
import { UserSuggestionList } from "@/components/UserSuggestionList";
import useStore from "@/store/useStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function ChatPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const { selectConversationId, setSelectConversationId } = useStore();
  const pathName = usePathname().split("/")[2];
  useEffect(() => {
    setSelectConversationId(pathName);
  }, [pathName]);
  return (
    <div className="flex flex-row w-full p-4 bg-primary-foreground min-h-screen h-screen overflow-hidden">
      <Sidebar />
      {params.conversationId !== "user-suggested" ? (
        <>
          <ConversationList />
          <ChatView />
        </>
      ) : (
        <UserSuggestionList />
      )}
    </div>
  );
}
