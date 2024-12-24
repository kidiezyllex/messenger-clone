import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useUploadThing } from "@/utils/uploadthing";
import axios from "axios";
import {
  CirclePlus,
  ImageIcon,
  Send,
  SmilePlus,
  Sticker,
  ThumbsUp,
  X,
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import StickerBoard from "./StickerBoard";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Message } from "../../../lib/entity-types";

export default function ChatViewBottom({
  conversationId,
  userId,
  replyMessage,
}: {
  conversationId: string;
  userId: string;
  replyMessage: Message | null;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    if (replyMessage) {
      setIsReplying(true);
      inputRef.current?.focus();
    } else {
      setIsReplying(false);
    }
  }, [replyMessage]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" || selectedImage) {
      try {
        setSending(true);
        let imageUrl = "";
        if (selectedImage) {
          const res = await startUpload([selectedImage]);
          imageUrl = res[0].url;
        }
        await axios.post(`/api/messages`, {
          conversationId,
          image: imageUrl,
          content: inputMessage,
          senderId: userId,
          type: imageUrl?.trim() === "" ? "text" : "image",
          replyMessageId: isReplying ? replyMessage?.id : "",
          replyText: isReplying ? replyMessage?.text : "",
        });
        setInputMessage("");
        setSelectedImage(null);
        setIsReplying(false);
        setSending(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const cancelReply = () => {
    setIsReplying(false);
  };

  return (
    <div className="flex flex-col p-3 border-t dark:border-t-zinc-700 border-t-zinc-300">
      {selectedImage && (
        <div className="relative mb-2 dark:bg-zinc-700 p-4 rounded-lg">
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt="Selected image"
            width={100}
            height={100}
            className="rounded-lg"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full bg-zinc-800 dark:hover:bg-primary-foreground"
            onClick={removeSelectedImage}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
      {isReplying && (
        <div className="flex items-center justify-between p-2 rounded-lg mb-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-white font-semibold">Trả lời tin nhắn</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
              {replyMessage?.text}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-primary-foreground"
            onClick={cancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex flex-row relative">
        {sending && (
          <div className="absolute bottom-14 flex flex-row w-full items-center justify-center">
            <Badge className="bg-zinc-900 text-slate-300 pointer-events-none">
              Đang gửi ...
            </Badge>
          </div>
        )}
        <div className="flex flex-row">
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
          >
            <CirclePlus className="h-5 w-5 text-blue-500 " />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
            onClick={handleImageButtonClick}
          >
            <ImageIcon className="h-5 w-5 text-blue-500 " />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="hover:bg-primary-foreground rounded-full"
              >
                <Sticker className="h-5 w-5 text-blue-500 " />
              </Button>
            </DropdownMenuTrigger>
            <StickerBoard
              userId={userId}
              conversationId={conversationId}
              setSending={setSending}
            ></StickerBoard>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 flex-grow relative px-1">
          <Input
            ref={inputRef}
            placeholder={
              isReplying ? "Type your reply..." : "Type a message..."
            }
            className="flex-1 rounded-full"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <SmilePlus className="h-5 w-5 text-blue-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="hover:bg-primary-foreground rounded-full"
          onClick={handleSendMessage}
        >
          {inputMessage.trim() !== "" || selectedImage ? (
            <Send className="h-5 w-5 text-blue-500" />
          ) : (
            <ThumbsUp className="h-5 w-5 text-blue-500" />
          )}
        </Button>
      </div>
    </div>
  );
}
