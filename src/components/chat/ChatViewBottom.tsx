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
import StickerBoard from "./StickerBoard/page";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Conversation, Message, User } from "../../../lib/entity-types";
import SelectedImage from "./SelectedImage/page";
import SelectedFile from "./SelectedFile/page";
import { useChat } from "ai/react";
import { renderBackgroundTheme } from "../../../lib/utils";

export default function ChatViewBottom({
  conversationId,
  userId,
  replyMessage,
  setReplyMessage,
  conversation,
  localTheme,
}: {
  conversationId: string;
  userId: string;
  replyMessage: Message | null;
  setReplyMessage: (message: Message) => void;
  conversation: Conversation;
  localTheme: string;
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
  const { input, handleInputChange } = useChat();
  const [showUserList, setShowUserList] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(null);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const userListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (replyMessage) {
      setIsReplying(true);
      inputRef.current?.focus();
    } else {
      setIsReplying(false);
    }
  }, [replyMessage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userListRef.current &&
        !userListRef.current.contains(event.target as Node)
      ) {
        setShowUserList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
          taggedUsers: taggedUsers,
        });
        setInputMessage("");
        setSelectedImage(null);
        setSelectedFile(null);
        setIsReplying(false);
        setSending(false);
        setSelectedFile(null);
        setShowUserList(false);
        setFilteredUsers(null);
        setTaggedUsers([]);
      } catch (error) {
        console.error(error);
        setSending(false);
        setShowUserList(false);
        setTaggedUsers([]);
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

  const cancelReply = () => {
    setIsReplying(false);
    setReplyMessage(null);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cursorPosition = e.currentTarget.selectionStart;
    const textBeforeCursor = e.currentTarget.value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1 && conversation?.isGroup) {
      const searchTerm = textBeforeCursor.slice(lastAtSymbol + 1).toLowerCase();
      const filtered = conversation?.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
      setFilteredUsers(filtered);
      setShowUserList(true);
    } else {
      setShowUserList(false);
    }
  };

  const insertUserTag = (userName: string) => {
    setTaggedUsers([...taggedUsers, userName]);
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || 0;
      const textBeforeCursor = input.slice(0, cursorPosition);
      const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

      if (lastAtSymbol !== -1) {
        const newInput =
          input.slice(0, lastAtSymbol) +
          `@${userName} ` +
          input.slice(cursorPosition);

        handleInputChange({
          target: { value: newInput },
        } as React.ChangeEvent<HTMLInputElement>);

        // Set cursor position after the inserted tag
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPosition = lastAtSymbol + userName.length + 2;
            inputRef.current.setSelectionRange(
              newCursorPosition,
              newCursorPosition
            );
            inputRef.current.focus();
          }
        }, 0);
      }
    }
    setShowUserList(false);
  };

  return (
    <div
      className={`flex flex-col p-3 border-t dark:border-t-zinc-700 border-t-zinc-300 rounded-bl-xl rounded-br-xl ${renderBackgroundTheme(
        localTheme
      )}`}
    >
      {selectedImage && (
        <SelectedImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        ></SelectedImage>
      )}
      {selectedFile && (
        <SelectedFile
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        ></SelectedFile>
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
      {showUserList && (
        <div
          ref={userListRef}
          // className="absolute bottom-full left-0 w-full bg-red-300 border border-gray-300 rounded-md shadow-lg z-10"
          className="bg-background dark:bg-zinc-900 w-fit rounded-md p-2 border dark:border-zinc-700 mb-4"
        >
          {filteredUsers?.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-zinc-700 cursor-pointer rounded-md"
              onClick={() => insertUserTag(user.name)}
            >
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {user.name}
              </p>
            </div>
          ))}
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
        <div className="flex flex-row gap-1">
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
        <div className="flex gap-2 flex-grow relative px-1 bg-background rounded-full border mx-1">
          {taggedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 items-center h-full">
              {taggedUsers.map((user, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-background dark:bg-zinc-900 rounded-full py-1 flex justify-between items-center"
                >
                  <p className="text-blue-500">@{user}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-1 p-0 h-4 w-4"
                    onClick={() =>
                      setTaggedUsers(taggedUsers.filter((u) => u !== user))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          <Input
            ref={inputRef}
            placeholder={
              isReplying ? "Type your reply..." : "Type a message..."
            }
            className="flex-1 border-none rounded-full"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            onKeyUp={handleKeyUp}
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
