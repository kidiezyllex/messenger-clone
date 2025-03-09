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
    setBackground(`https://picsum.photos/450/200?random=${Date.now()}`);
  }, [user?.id, open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col gap-0 rounded-xl shadow-lg [&>button]:hidden">
        <DialogTitle className="h-fit px-4 py-3 m-0 text-lg font-bold text-zinc-600 dark:text-zinc-300 border-b dark:border-b-zinc-700 border-b-zinc-300 flex justify-between items-center">
          Thông tin tài khoản
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </DialogTitle>
        <div className="relative max-h-48 h-48 w-full">
          {/* Banner Image */}
          <div className="absolute inset-0 z-10" />
          <Image
            src={background}
            alt="user-profile-background"
            fill
            className="object-cover w-full"
            sizes="100vw"
            quality={100}
          />
          {/* Avatar */}
          <div className="absolute -bottom-12 left-4 flex flex-row items-center">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-10 ml-2">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {user?.name}
              </h2>
              <div className="bg-blue-500 rounded-full p-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 px-6 mt-16 mb-6">
          <p className="font-semibold text-base border-b-2 border-b-blue-500 pb-2 inline-block">
            Thông tin cá nhân
          </p>
          <div className="grid gap-0 text-sm">
            <div className="flex justify-between items-center p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Email:</span>
              <span className="text-slate-700 dark:text-slate-300">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Đã tham gia vào lúc:
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatDate2(user?.createAt)}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Bạn bè:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {user?.friends?.length || 0} người bạn
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
