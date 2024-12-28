import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useUploadThing } from "@/utils/uploadthing";
import axios from "axios";
import {
  CirclePlus,
  FileText,
  ImageIcon,
  Send,
  SmilePlus,
  Sticker,
  ThumbsUp,
  X,
  FileImage,
  FileAudio,
  FileVideo,
  FileIcon as FilePdf,
  FileArchive,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import StickerBoard from "./StickerBoard/page";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Message } from "../../../lib/entity-types";

export default function ChatViewBottom({
  conversationId,
  userId,
  replyMessage,
  setReplyMessage,
}: {
  conversationId: string;
  userId: string;
  replyMessage: Message | null;
  setReplyMessage: (message: Message) => void;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const { startUpload: startFileUpload } = useUploadThing("productPdf");

  useEffect(() => {
    if (replyMessage) {
      setIsReplying(true);
      inputRef.current?.focus();
    } else {
      setIsReplying(false);
    }
  }, [replyMessage]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" || selectedImage || selectedFile) {
      try {
        setSending(true);
        let imageUrl = "";
        let fileUrl = "";
        if (selectedImage) {
          const res = await startImageUpload([selectedImage]);
          if (res && res[0]) {
            imageUrl = res[0].url;
          }
        }
        if (selectedFile) {
          const res = await startFileUpload([selectedFile]);
          if (res && res[0]) {
            fileUrl = res[0].url;
          }
        }
        await axios.post(`/api/messages`, {
          conversationId,
          image: imageUrl,
          file: fileUrl,
          fileName: selectedFile?.name || "",
          content: inputMessage,
          senderId: userId,
          type: fileUrl ? "file" : imageUrl ? "image" : "text",
          replyMessageId: isReplying ? replyMessage?.id : "",
          replyText: isReplying ? replyMessage?.text : "",
        });
        setInputMessage("");
        setSelectedImage(null);
        setSelectedFile(null);
        setIsReplying(false);
        setSending(false);
        setSelectedFile(null);
      } catch (error) {
        console.error(error);
        setSending(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(null);
    }
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const cancelReply = () => {
    setIsReplying(false);
    setReplyMessage(null);
  };

  const renderFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "text/plain":
        return <FileText className="h-4 w-4" />;
      case "image/jpeg":
      case "image/png":
      case "image/gif":
      case "image/webp":
        return <FileImage className="h-4 w-4" />;
      case "audio/mpeg":
      case "audio/wav":
      case "audio/ogg":
        return <FileAudio className="h-4 w-4" />;
      case "video/mp4":
      case "video/mpeg":
      case "video/quicktime":
        return <FileVideo className="h-4 w-4" />;
      case "application/pdf":
        return <FilePdf className="h-4 w-4" />;
      case "application/zip":
      case "application/x-rar-compressed":
        return <FileArchive className="h-4 w-4" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
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
            className="h-6 w-6 absolute top-2 right-2 rounded-full bg-zinc-800 dark:hover:bg-primary-foreground"
            onClick={removeSelectedImage}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
      {selectedFile && (
        <div className="relative mb-2 dark:bg-zinc-700 p-4 rounded-lg">
          <div className="flex flex-row items-center gap-2">
            {renderFileTypeIcon(selectedFile.type)}
            <p className="text-sm font-semibold dark:text-slate-300 text-slate-600">
              {selectedFile.name}
            </p>
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-6 w-6 absolute top-2 right-2 rounded-full bg-zinc-800 dark:hover:bg-primary-foreground"
            onClick={removeSelectedFile}
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
            onClick={handleFileButtonClick}
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
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".txt,.mp4,.mov,.mp3,.wav,.pdf"
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
          {inputMessage.trim() !== "" || selectedImage || selectedFile ? (
            <Send className="h-5 w-5 text-blue-500" />
          ) : (
            <ThumbsUp className="h-5 w-5 text-blue-500" />
          )}
        </Button>
      </div>
    </div>
  );
}
