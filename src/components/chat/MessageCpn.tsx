"use client";

import React, { useState } from "react";
import { Message } from "../../../lib/entity-types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { formatDate3 } from "../../../lib/utils";
import {
  Smile,
  MessageCircleReply,
  EllipsisVertical,
  Pencil,
  RotateCcw,
  Forward,
  Pin,
  Quote,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function MessageCpn({
  message,
  userId,
  setReplyMessage,
}: {
  message: Message;
  userId: string;
  setReplyMessage: (message: Message) => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const handleReaction = (emoji: string) => {
    setReaction(emoji);
  };

  const handleReply = (message: Message) => {
    setReplyMessage(message);
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit message:", message.id);
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Delete message:", message.id);
  };

  const handleForward = () => {
    // Implement forward functionality
    console.log("Forward message:", message.id);
  };

  const handlePin = () => {
    // Implement pin functionality
    console.log("Pin message:", message.id);
  };

  return (
    <div
      className={`relative ${
        message?.senderId === userId
          ? "flex gap-3 flex-row-reverse"
          : "flex gap-3"
      }`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={message?.sender?.image} />
        <AvatarFallback className="bg-blue-400 text-white border-2 border-blue-300 dark:border-secondary">
          {message?.sender?.name[0]}
        </AvatarFallback>
      </Avatar>
      <div
        className={
          message?.type === "sticker"
            ? ""
            : "rounded-lg bg-background dark:bg-zinc-700 py-2 px-4 max-w-[70%]"
        }
      >
        {message?.image ? (
          message?.type === "sticker" ? (
            <div className="relative max-h-24 w-auto">
              <Image
                src={message?.image}
                alt="Message Image"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-lg max-h-24 w-auto object-contain"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          ) : (
            <div className="relative max-h-52 w-auto mb-2">
              <Image
                src={message?.image}
                alt="Message Image"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-lg max-h-52 w-auto object-contain"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          )
        ) : null}

        <div className="flex flex-col gap-2 relative">
          {message?.replyText && (
            <div className="flex flex-row gap-2 items-center text-sm text-zinc-600 dark:text-zinc-300 p-2 rounded-md bg-background dark:bg-zinc-900 italic">
              <Quote className="h-4 w-4 text-zinc-600 dark:text-zinc-300 italic"></Quote>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {message?.replyText}
              </p>
            </div>
          )}
          <p className="text-base text-zinc-600 dark:text-zinc-300">
            {message?.text}
          </p>
          <p className="text-xs text-muted-foreground self-end">
            {formatDate3(message?.createdAt)}
          </p>
          {reaction && (
            <div className="border absolute -bottom-6 -right-8 bg-background dark:bg-zinc-700 rounded-full p-0.5 px-2 text-xs">
              {reaction}
            </div>
          )}
        </div>
      </div>

      <div
        className={
          message?.senderId === userId
            ? "self-center flex"
            : "flex self-center flex-row-reverse"
        }
      >
        {showOptions && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary-foreground rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Smile className="h-5 w-5 dark:text-slate-300 text-slate-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1 rounded-full bg-background dark:bg-zinc-900 px-4">
                <div className="flex items-center">
                  {reactionEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="text-xl hover:bg-muted p-1 rounded"
                      variant="ghost"
                      size="icon"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary-foreground"
              onClick={() => handleReply(message)}
            >
              <MessageCircleReply className="h-5 w-5 dark:text-slate-300 text-slate-600" />
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-primary-foreground"
              onClick={() => setShowOptions(true)}
            >
              <EllipsisVertical className="h-5 w-5 dark:text-slate-300 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-background dark:bg-zinc-900 dark:text-slate-300 text-slate-600"
          >
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Thu hồi</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleForward}>
              <Forward className="mr-2 h-4 w-4" />
              <span>Chuyển tiếp</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePin}>
              <Pin className="mr-2 h-4 w-4" />
              <span>Ghim</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
