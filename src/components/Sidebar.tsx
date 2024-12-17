"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Archive,
  Store,
  MessageCircleMore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { User } from "../../lib/entity-types";
import axios from "axios";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navItems = [
  { icon: MessageCircle, label: "Đoạn chat" },
  { icon: Store, label: "Marketplace" },
  { icon: MessageCircleMore, label: "Tin nhắn đang chờ" },
  { icon: Archive, label: "Kho lưu trữ" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState<User>();
  const { data: session } = useSession();
  return (
    <div
      className={cn(
        "h-full flex flex-col justify-between transition-all duration-100",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="space-y-3 mr-4">
        {navItems.map((item) => (
          <TooltipProvider>
            <Tooltip key={item.label} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={cn(
                    "flex flex-row items-center justify-start gap-3 px-4 dark:bg-secondary bg-purple-600 hover:bg-purple-700 dark:text-slate-300 w-full",
                    !expanded &&
                      "px-0 justify-center items-center dark:bg-secondary"
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
      <div className="space-y-3">
        <div className={cn("flex items-center", expanded)}>
          <Avatar className="w-10 h-10 bg-background">
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback>{session?.user?.name[0]}</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="ml-2">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setExpanded(!expanded)}
          className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-secondary"
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
