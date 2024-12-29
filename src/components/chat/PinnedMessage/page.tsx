import React, { useState } from "react";
import { Message } from "../../../../lib/entity-types";
import { Button } from "@/components/ui/button";
import { formatDate2, renderBackgroundTheme } from "../../../../lib/utils";
import { ChevronDown, Pin } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PinnedMessageDialog } from "../PinnedMessageDialog/page";

export default function PinnedMessage({
  message,
  pinnedMessages,
  localTheme,
}: {
  message: Message;
  pinnedMessages: Message[];
  localTheme: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div
      className={`flex flex-row justify-between border-b border-b-zinc-700 p-2 px-3 items-center ${renderBackgroundTheme(
        localTheme
      )}`}
    >
      <div className="flex gap-2">
        <div className="h-10 w-10 dark:bg-zinc-700 bg-background rounded-full flex items-center justify-center">
          <Pin className="h-4 w-4 text-blue-500" />
        </div>
        <div className="space-y-1">
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
            {message?.sender?.name}
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
            {message?.image || message?.file
              ? "File phương tiện"
              : message?.text}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <p className="text-xs text-muted-foreground">
          {formatDate2(message?.createdAt)}
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <div className="cursor-pointer h-8 w-8 dark:hover:bg-zinc-700 bg-transparent rounded-full flex items-center justify-center">
              <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </div>
          </DialogTrigger>
          <PinnedMessageDialog
            setIsDialogOpen={setIsDialogOpen}
            pinnedMessages={pinnedMessages}
          />
        </Dialog>
      </div>
    </div>
  );
}
