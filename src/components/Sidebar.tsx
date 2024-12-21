"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle,
  Archive,
  Store,
  MessageCircleMore,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: MessageCircle, label: "Đoạn chat" },
  { icon: Store, label: "Marketplace" },
  { icon: MessageCircleMore, label: "Tin nhắn đang chờ" },
  { icon: Archive, label: "Kho lưu trữ" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session) router.push("/");
  }, []);
  return (
    <div
      className={cn(
        "h-full flex flex-col justify-between transition-all duration-100",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="space-y-3 mr-4">
        {navItems.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip key={item.label} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={cn(
                    "flex flex-row items-center justify-start gap-3 px-4 dark:bg-background bg-blue-400 text-white border-2 border-blue-300 hover:bg-blue-500 dark:text-slate-300 w-full dark:border dark:border-secondary",
                    !expanded &&
                      "px-0 justify-center items-center dark:bg-background"
                  )}
                >
                  <item.icon className="h-5 w-5 dark:text-slate-300" />
                  {expanded && (
                    <span className="font-semibold text-sm">{item.label}</span>
                  )}
                </Button>
              </TooltipTrigger>
              {!expanded && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="flex flex-col gap-2 items-start w-full transition-all">
        {expanded ? null : <ModeToggle></ModeToggle>}
        <div className={cn("flex items-center w-full pr-4", expanded)}>
          <Avatar
            className="w-10 h-10 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
              {session?.user?.name[0]}
            </AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="ml-2 flex flex-row justify-between flex-grow transition-all">
              <div>
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <Button
                size="icon"
                className="rounded-full w-10 h-10"
                variant="outline"
                onClick={() => {
                  signOut();
                }}
              >
                <LogOut className="h-4 w-4"></LogOut>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
