"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConversationList } from "@/components/layout/ConversationList";
import { ChatView } from "@/components/layout/ChatView";
import { UserSuggestionList } from "@/components/layout/UserSuggestionList";
import useStore from "@/store/useStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
      {params.conversationId !== "user-suggested" &&
      selectConversationId !== "user-suggested" ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={29} minSize={27} maxSize={40}>
            <ConversationList />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={71}>
            <ChatView />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <UserSuggestionList />
      )}
    </div>
  );
}
