"use client";
import React, { useEffect, useState } from "react";
import { Message } from "../../../../lib/entity-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate3 } from "../../../../lib/utils";
import {
  Smile,
  MessageCircleReply,
  EllipsisVertical,
  Pencil,
  RotateCcw,
  Forward,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ForwardDialog } from "../ForwardDialog/page";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoCall from "../VideoCallDialog/page";
import { useSession } from "next-auth/react";
import axios from "axios";
import useStore from "@/store/useStore";
import { StickerMessage } from "../StickerMessage/page";
import { ImageMessage } from "../ImageMessage/page";
import { TextMessage } from "../TextMessage/page";
// import { FileMessage }
import { CallMessage } from "../CallMessage/page";
import { FileMessage } from "../FileMessage/page";
import { pusherClient } from "@/lib/pusher";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const { data: session } = useSession();
  const { setSelectConversationId, selectConversationId } = useStore();
  const [revokedMessage, setRevokedMessage] = useState<Message | null>(null);

  const handleReply = (message: Message) => {
    setReplyMessage(message);
  };
  const handleReaction = (emoji: string) => {
    setReaction(emoji);
  };
  const handleRevoke = async (message: Message) => {
    await axios.patch(`/api/messages/${message?.id}`, {
      content: "Tin nhắn đã thu hồi",
      type: "revoke",
    });
  };
  const handlePin = async () => {
    await axios.patch(`/api/conversations/${selectConversationId}`, {
      message: message,
      action: "pin",
    });
  };
  const toggleVideoCall = () => {
    setIsVideoCallActive(!isVideoCallActive);
  };

  useEffect(() => {
    if (!message?.id) return;
    pusherClient.subscribe(message?.id);
    pusherClient.bind("message:revoke", (updatedMsg: Message) => {
      if (updatedMsg?.id === message?.id) {
        setRevokedMessage(updatedMsg);
      }
    });

    return () => {
      pusherClient.unsubscribe(message.id);
      pusherClient.unbind("message:revoke");
    };
  }, [message?.id]);

  return (
    <div
      className={` ${
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
          !revokedMessage && message?.type === "sticker"
            ? ""
            : "relative rounded-lg bg-background dark:bg-zinc-700 py-2 px-4 max-w-[70%] space-y-2"
        }
      >
        {(revokedMessage || message)?.type === "revoke" && (
          <TextMessage
            text={(revokedMessage || message)?.text}
            replyText={""}
          />
        )}
        {!revokedMessage && message?.type === "sticker" && message.image && (
          <StickerMessage image={message.image} />
        )}
        {!revokedMessage && message?.type === "image" && message.image ? (
          message?.text ? (
            <>
              <ImageMessage image={message.image} />
              <TextMessage text={message.text} replyText={message.replyText} />
            </>
          ) : (
            <ImageMessage image={message.image} />
          )
        ) : null}
        {!revokedMessage && message?.type === "text" && (
          <TextMessage
            text={message.text}
            replyText={message.replyText}
            taggedUsers={message?.taggedUsers}
          />
        )}
        {!revokedMessage && message?.type === "file" && message?.file ? (
          message?.text ? (
            <>
              <FileMessage file={message.file} fileName={message.fileName} />
              <TextMessage text={message.text} replyText={message.replyText} />
            </>
          ) : (
            <FileMessage file={message.file} fileName={message.fileName} />
          )
        ) : null}
        {message?.type === "call" && (
          <CallMessage
            onCallClick={toggleVideoCall}
            createdAt={message?.createdAt}
          />
        )}
        <p
          className={`text-xs text-muted-foreground  ${
            message?.senderId === userId ? "text-start" : "text-end"
          }`}
        >
          {formatDate3(message?.createdAt)}
        </p>
        {reaction && (
          <div className="border absolute -bottom-3 -right-4 bg-background dark:bg-zinc-700 rounded-full p-0.5 px-2 text-xs">
            {reaction}
          </div>
        )}
      </div>
      {!(
        message?.type === "call" ||
        (revokedMessage || message)?.type === "revoke"
      ) ? (
        <div
          className={
            message?.senderId === userId
              ? "self-center flex"
              : "flex self-center flex-row-reverse"
          }
        >
          {/* 3 chấm, react, reply */}
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
              align="center"
              className="bg-background dark:bg-zinc-900 dark:text-slate-300 text-slate-600"
            >
              {message?.senderId === userId && (
                <DropdownMenuItem onClick={() => handleRevoke(message)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  <span>Thu hồi</span>
                </DropdownMenuItem>
              )}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>
                  <DropdownMenuItem
                    onClick={(e) => {
                      setIsDialogOpen(true);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <Forward className="mr-2 h-4 w-4" />
                    <span>Chuyển tiếp</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <ForwardDialog
                  message={message}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </Dialog>
              <DropdownMenuItem onClick={handlePin}>
                <Pin className="mr-2 h-4 w-4" />
                <span>Ghim</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
      <Dialog open={isVideoCallActive} onOpenChange={toggleVideoCall}>
        <DialogTitle></DialogTitle>
        <DialogContent
          className="max-w-[90vw] w-[100%] h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "#1C1F2E" }}
        >
          <VideoCall
            roomId={message?.conversationId}
            userId={(session?.user as any)?.id}
            userName={(session?.user as any)?.name}
            onClose={toggleVideoCall}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
