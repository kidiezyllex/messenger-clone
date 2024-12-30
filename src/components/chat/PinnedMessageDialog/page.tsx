"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Conversation, Message } from "../../../../lib/entity-types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MessageCpn from "../Message/page";

export function PinnedMessageDialog({
  pinnedMessages,
  userId,
}: {
  pinnedMessages: Message[];
  userId: string;
}) {
  const sortByCreatedAt = (array: Message[]) => {
    return array.sort((a: Message, b: Message) => {
      const timeA = new Date(a?.createdAt).getTime();
      const timeB = new Date(b?.createdAt).getTime();
      return timeA - timeB;
    });
  };
  return (
    <DialogContent className="max-w-[800px] w-[95%] h-[90%] overflow-y-auto flex flex-col gap-4">
      <DialogTitle className="h-fit pb-2 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300">
        Tin nhắn đã ghim
      </DialogTitle>
      <div className="flex flex-col space-y-4 mr-4">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {sortByCreatedAt(pinnedMessages).map((message) => (
              <MessageCpn
                key={message.id}
                message={message}
                userId={userId}
                setReplyMessage={null}
              />
            ))}
          </div>
          <ScrollBar
            orientation="vertical"
            className="dark:bg-primary-foreground bg-secondary"
          />
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
