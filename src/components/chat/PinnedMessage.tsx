import React from "react";
import { Message } from "../../../lib/entity-types";
import { Button } from "../ui/button";
import { formatDate2 } from "../../../lib/utils";
import { ChevronDown, Pin } from "lucide-react";

export default function PinnedMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-row gap-2 border-b border-b-zinc-700 p-2 px-3 items-center">
      <Button
        size="icon"
        className="dark:bg-zinc-700 bg-background rounded-full h-10 w-10"
      >
        <Pin className="h-5 w-5 text-blue-500" />
      </Button>
      <div className="flex flex-row justify-between items-center w-full">
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
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs text-muted-foreground">
            {formatDate2(message?.createdAt)}
          </p>
          <Button size="sm" variant="ghost">
            <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
