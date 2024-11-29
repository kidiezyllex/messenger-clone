"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Archive,
  Settings,
  Store,
  Users,
  MessageCircleMore,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: MessageCircle, label: "Đoạn chat" },
  { icon: Store, label: "Marketplace" },
  { icon: MessageCircleMore, label: "Tin nhắn đang chờ" },
  { icon: Archive, label: "Kho lưu trữ" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);

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
                    "flex flex-row items-center justify-start gap-3 px-4 dark:bg-secondary dark:text-slate-300 w-full",
                    !expanded && "justify-center items-center dark:bg-secondary"
                  )}
                >
                  <item.icon className="h-5 w-5 dark:text-slate-300" />
                  {expanded && <span>{item.label}</span>}
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
          <Button
            size="icon"
            className="rounded-full bg-secondary border border-blue-500"
          ></Button>
          {expanded && (
            <div className="ml-2">
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          )}
        </div>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setExpanded(!expanded)}
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
