import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ChatView } from "@/components/ChatView";
import { UserSuggestionList } from "@/components/UserSuggestionList";

export default function ChatPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return (
    <div className="flex flex-row w-full p-4 bg-primary-foreground min-h-screen h-screen overflow-hidden">
      <Sidebar />
      {params.conversationId !== "new-account" ? (
        <>
          <ConversationList />
          <ChatView conversationId={params.conversationId} />
        </>
      ) : (
        <UserSuggestionList />
      )}
    </div>
  );
}
