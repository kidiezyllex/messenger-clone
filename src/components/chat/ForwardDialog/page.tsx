"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, SearchIcon, Send } from "lucide-react";
import { Conversation, Message } from "../../../../lib/entity-types";
import axios from "axios";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loading from "@/components/animation/Loading";
import { ConversationItem } from "@/components/conversation/ConversationItem";
import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";

export function ForwardDialog({
  message,
  setIsDialogOpen,
}: {
  message: Message;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState({ val: false, id: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;
  const { setSelectConversationId } = useStore();

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        setLoading(true);
        const res = await axios.get(`/api/conversations/user/${userId}`);
        const filterConversation = res.data.filter(
          (conversation: any) => conversation?.id !== message?.conversationId
        );
        setConversations(filterConversation);
        setLoading(false);
      };
      fetchData();
    }
  }, [status, userId]);

  const handleSendMessage = async (conversationId: string) => {
    try {
      setIsSending({ val: true, id: conversationId });
      await axios.post(`/api/messages`, {
        conversationId: conversationId,
        image: message?.image,
        file: message?.file,
        content: message?.text,
        senderId: userId,
        type: message?.file ? "file" : message?.image ? "image" : "text",
        replyMessageId: "",
        replyText: "",
      });
      setIsSending({ val: false, id: "" });
      setIsDialogOpen(false);
      window.history.pushState(null, "", `/t/${conversationId}`);
      setSelectConversationId(conversationId);
    } catch (error) {
      setIsSending({ val: false, id: "" });
      console.error(error);
    }
  };
  const filteredConversations = conversations.filter((conversations) =>
    conversations.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <DialogContent className="max-w-[800px] w-[95%] h-[90%] overflow-y-auto flex flex-col gap-4">
      <DialogTitle className="h-fit pb-2 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300">
        Chuyển tiếp
      </DialogTitle>
      <div className="flex flex-col space-y-4 mr-4">
        <div className="relative rounded-full flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Nhập tên, email"
            className="dark:bg-primary-foreground pl-9 text-sm rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className={"rounded-md"}>
          {loading ? (
            <Loading />
          ) : (
            filteredConversations.map((conversation, index) => (
              <div
                className="flex flex-row gap-4 w-full items-center justify-between"
                key={conversation?.id + index}
              >
                <ConversationItem
                  conversation={conversation}
                  lastMessage={undefined}
                  index={0}
                ></ConversationItem>
                <Button
                  onClick={() => handleSendMessage(conversation?.id)}
                  className="flex flex-row gap-2 bg-blue-400 hover:bg-blue-400 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary"
                >
                  {isSending.val && isSending.id === conversation?.id ? (
                    <>
                      Đang gửi
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Gửi <Send className="h-4 w-4 ml-2"></Send>
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
          <ScrollBar
            orientation="vertical"
            className="dark:bg-primary-foreground bg-secondary"
          />
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
