"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Archive,
  Store,
  MessageCircleMore,
  LogOut,
  EllipsisVertical,
  ContactRound,
  Settings,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "../ModeToggle";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: MessageCircle, label: "Đoạn chat", id: "conversation" },
  { icon: Store, label: "Marketplace", id: "marketplace" },
  { icon: MessageCircleMore, label: "Tin nhắn đang chờ", id: "pending-messages" },
  { icon: Archive, label: "Kho lưu trữ", id: "archive" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        expanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[role="menuitem"]')
      ) {
        setExpanded(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    // Use mouseup instead of mousedown
    document.addEventListener("mouseup", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [expanded]);

  if (!session && status === "unauthenticated") router.push("/");

  const handleNavItemClick = (id: string) => {
    if (id === "conversation" && session?.user) {
      router.push(`/t/${(session.user as any)?.lastConversationId}`);
    }
    // Có thể thêm xử lý cho các mục khác ở đây
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "h-full flex flex-col justify-between transition-all duration-100",
        expanded ? "w-72" : "w-16"
      )}
    >
      <div className="space-y-3 mr-4">
        {navItems.map((item, index) => (
          <TooltipProvider key={item.id}>
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={cn(
                    "flex flex-row items-center justify-start gap-3 px-4 dark:bg-background bg-blue-400 text-white border-2 border-blue-300 hover:bg-blue-500 dark:text-slate-300 w-full dark:border dark:border-secondary",
                    !expanded &&
                      "px-0 justify-center items-center dark:bg-background"
                  )}
                  onClick={() => handleNavItemClick(item.id)}
                >
                  <item.icon className="h-5 w-5 dark:text-slate-300" />
                  {expanded && (
                    <span className="font-semibold text-sm">{item.label}</span>
                  )}
                </Button>
              </TooltipTrigger>
              {!expanded && (
                <TooltipContent
                  side="right"
                  className="bg-background dark:text-slate-300 text-slate-600 font-semibold border dark:border-primary-foreground"
                >
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="flex flex-col gap-2 items-start w-full transition-all">
        {expanded ? null : <ModeToggle />}
        <div className={cn("flex items-center w-full pr-4", expanded)}>
          <Avatar
            className="w-10 h-10 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
              {session?.user?.name?.[0]}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer h-8 w-8 rounded-full hover:bg-background pointer-events-auto flex flex-row justify-center items-center">
                    <EllipsisVertical className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-60 items-end mb-4 bg-background dark:bg-zinc-900 dark:text-slate-300 text-slate-600"
                  align="end"
                >
                  <DropdownMenuItem className="p-2 flex justify-between">
                    <span className="font-semibold text-sm">Cài đặt</span>
                    <Settings className="h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-2 flex justify-between">
                    <span className="font-semibold text-sm">
                      Cập nhật hồ sơ
                    </span>
                    <ContactRound className="h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="p-2 flex justify-between"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <span className="font-semibold text-sm">Đăng xuất</span>
                    <LogOut className="h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
