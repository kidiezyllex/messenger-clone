"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, MessageCircleMore, X } from "lucide-react";
import { User } from "../../../../lib/entity-types";
import { formatDate2 } from "../../../../lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ProfileDialogProps {
  user?: User;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function UserProfileDialog({
  user,
  open,
  setOpen,
}: ProfileDialogProps) {
  const [background, setBackground] = useState("");
  useEffect(() => {
    setBackground("https://picsum.photos/450/200");
  }, [user?.id]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col gap-0">
        <DialogTitle className="h-fit px-4 py-2 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300">
          Thông tin tài khoản
        </DialogTitle>
        <div className="relative max-h-48 h-48 w-full">
          {/* Banner Image */}
          <Image
            src={background}
            alt="Message Image"
            fill
            className="object-cover w-full"
            sizes="100vw"
          />
          {/* Avatar */}
          <div className="absolute -bottom-12 left-4 flex flex-row items-center">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="text-lg bg-blue-400">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-10">
              <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                {user?.name}
              </h2>
              <Check className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 px-4 mt-16 mb-4">
          <p className="font-semibold text-base border-b-2 border-b-blue-500 pb-2">
            Thông tin cá nhân
          </p>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Đã tham gia vào lúc:
              </span>
              <span className="text-muted-foreground">
                {formatDate2(user?.createAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bạn bè:</span>
              <span className="text-muted-foreground">
                {user?.friends?.length || 0} người bạn
              </span>
            </div>
          </div>
          {/* <Button className="mt-4 w-full flex flex-row gap-2 bg-blue-500 hover:bg-blue-500 text-white border-2 border-blue-300 hover:border-blue-300 dark:border-secondary">
            Nhắn tin
            <MessageCircleMore className="h-4 w-4" />
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
