import React, { useEffect, useRef, useState } from "react";
import { Message } from "../../../../lib/entity-types";
import { formatDate2 } from "../../../../lib/utils";
import { ChevronDown, Pin } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PinnedMessageDialog } from "../PinnedMessageDialog/page";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";

export default function PinnedMessage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const conversationId = usePathname().split("/")[2];
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const { data: session, status } = useSession();
  const pusherInitialized = useRef(false);
  const [pinnedMessageRT, setPinnedMessageRT] = useState<Message>();

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      setPinnedMessages(res.data.pinnedMessages);
      setPinnedMessageRT(res.data.pinnedMessages[0]);
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
      fetchData();
    }
  }, [status, conversationId]);

  useEffect(() => {
    if (!pusherInitialized.current) {
      pusherClient.subscribe(conversationId);
      pusherClient.bind("message:pin", (message: Message) => {
        setPinnedMessageRT(message);
        setPinnedMessages((prev) => [message, ...prev]);
      });
      pusherInitialized.current = true;
    }

    return () => {
      if (pusherInitialized.current) {
        pusherClient.unsubscribe(conversationId);
        pusherClient.unbind("message:pin");
        pusherInitialized.current = false;
      }
    };
  }, [conversationId]);
  return (
    <div
      className={`flex flex-row justify-between border-b dark:border-b-zinc-700 border-b-zinc-300 p-2 px-3 items-center`}
    >
      <div className="flex gap-2">
        <div className="h-10 w-10 dark:bg-zinc-700 bg-background rounded-full flex items-center justify-center">
          <Pin className="h-4 w-4 text-blue-500" />
        </div>
        <div className="space-y-1">
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
            {pinnedMessageRT?.sender?.name}
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
            {pinnedMessageRT?.image || pinnedMessageRT?.file
              ? "File phương tiện"
              : pinnedMessageRT?.text}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <p className="text-xs text-muted-foreground">
          {formatDate2(pinnedMessageRT?.createdAt)}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <div className="cursor-pointer h-8 w-8 dark:hover:bg-zinc-700 bg-transparent rounded-full flex items-center justify-center">
              <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </div>
          </DialogTrigger>
          <PinnedMessageDialog
            pinnedMessages={pinnedMessages}
            userId={(session?.user as any)?.id}
          />
        </Dialog>
      </div>
    </div>
  );
}
