import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ChatView } from "@/components/ChatView";

export default function ChatPage() {
  return (
    <div className="flex flex-row w-full p-4 bg-primary-foreground min-h-screen h-screen overflow-hidden">
      <Sidebar />
      <ConversationList />
      <ChatView />
    </div>
  );
}
