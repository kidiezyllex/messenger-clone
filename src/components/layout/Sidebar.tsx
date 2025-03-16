"use client";

import { useEffect, useRef, useState } from "react";
import Icon from '@mdi/react';
import { 
  mdiChat, 
  mdiArchive, 
  mdiStorefront, 
  mdiChatProcessing, 
  mdiLogout, 
  mdiDotsVertical, 
  mdiAccountCircle, 
  mdiCog 
} from '@mdi/js';
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
import { motion } from "framer-motion";

const navItems = [
  { icon: mdiChat, label: "Đoạn chat", id: "conversation" },
  { icon: mdiStorefront, label: "Marketplace", id: "marketplace" },
  { icon: mdiChatProcessing, label: "Tin nhắn đang chờ", id: "pending-messages" },
  { icon: mdiArchive, label: "Kho lưu trữ", id: "archive" },
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
  };

  // Định nghĩa variants cho các animation
  const sidebarVariants = {
    expanded: { width: "18rem" }, // 72px = 18rem
    collapsed: { width: "4rem" }  // 16px = 4rem
  };

  const navItemTextVariants = {
    expanded: { opacity: 1, x: 0, display: "block" },
    collapsed: { opacity: 0, x: -10, display: "none" }
  };

  const profileContentVariants = {
    expanded: { opacity: 1, x: 0, y: 0, display: "flex" },
    collapsed: { opacity: 0, x: -10, y: 10, display: "none" }
  };

  return (
    <motion.div
      ref={sidebarRef}
      className={cn(
        "h-full flex flex-col justify-between overflow-hidden",
        expanded ? "w-[250px] max-w-[250px]" : "w-16"
      )}
      initial="collapsed"
      animate={expanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="space-y-3 mr-4">
        {navItems.map((item, index) => (
          <TooltipProvider key={item.id}>
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={cn(
                    "flex flex-row items-center justify-start gap-3 px-4 dark:bg-background/50 bg-blue-400 text-white border-2 border-blue-300 hover:bg-blue-500 dark:text-slate-300 w-full dark:border dark:border-secondary relative",
                    !expanded &&
                      "px-0 justify-center items-center dark:bg-background/50"
                  )}
                  onClick={() => handleNavItemClick(item.id)}
                >
                  <motion.div 
                    className="flex justify-center items-center w-6 h-6 absolute left-2.5"
                    variants={{
                      expanded: { x: 0 },
                      collapsed: { x: 0 }
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon path={item.icon} size={0.9} className="dark:text-slate-300" />
                  </motion.div>
                  
                  <motion.span 
                    className="font-semibold text-sm whitespace-nowrap overflow-hidden absolute left-14"
                    variants={{
                      expanded: { opacity: 1, width: "auto", display: "block" },
                      collapsed: { opacity: 0, width: 0, display: "none" }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.label}
                  </motion.span>
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
            <AvatarFallback className="bg-gradient-to-r from-blue-300 to-blue-500 text-white border-2 border-blue-300 dark:border-secondary select-none">
              {session?.user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <motion.div 
            className="ml-2 flex flex-row justify-between flex-grow"
            variants={profileContentVariants}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {expanded && (
              <>
                <div>
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer h-8 w-8 rounded-full hover:bg-background pointer-events-auto flex flex-row justify-center items-center">
                      <Icon path={mdiDotsVertical} size={0.9} />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-60 items-end mb-4 bg-background dark:bg-zinc-900 dark:text-slate-300 text-slate-600"
                    align="end"
                  >
                    <DropdownMenuItem className="p-2 flex justify-between">
                      <span className="font-semibold text-sm">Cài đặt</span>
                      <Icon path={mdiCog} size={0.9} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-2 flex justify-between">
                      <span className="font-semibold text-sm">
                        Cập nhật hồ sơ
                      </span>
                      <Icon path={mdiAccountCircle} size={0.9} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="p-2 flex justify-between"
                      onClick={() => {
                        signOut();
                      }}
                    >
                      <span className="font-semibold text-sm">Đăng xuất</span>
                      <Icon path={mdiLogout} size={0.9} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
