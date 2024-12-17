"use client";
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  CirclePlus,
  ImageIcon,
  Sticker,
  SmilePlus,
  ThumbsUp,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Conversation, Message } from "../../lib/entity-types";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useUploadThing } from "@/utils/uploadthing";
import { formatDate3 } from "../../lib/utils";
import { pusherClient } from "@/lib/pusher";

export function ChatView({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader");

  const fetchData = async () => {
    const res = await axios.get(`/api/conversations/${conversationId}`);
    setConversation(res.data);
    setMessages(res.data.messages);
  };

  useEffect(() => {
    fetchData();

    pusherClient.subscribe(conversationId);
    pusherClient.bind("message:new", (message: Message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new");
    };
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" || selectedImage) {
      try {
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
        });

        setInputMessage("");
        setSelectedImage(null);
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

  return (
    <div className="flex h-full flex-1 flex-col flex-grow bg-secondary rounded-xl ml-4 border">
      <div className="flex items-center justify-between p-3 border-b dark:border-b-zinc-600 border-b-zinc-300">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={conversation?.users[1]?.image} />
            <AvatarFallback>{conversation?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-zinc-600 dark:text-zinc-300">
              {conversation?.users[1]?.name}
            </h2>
            <p className="text-sm text-muted-foreground">Đang hoạt động</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-500 hover:text-violet-300"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-500 hover:text-violet-300"
          >
            <Video className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-violet-500 hover:text-violet-300"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto space-y-2 px-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message?.senderId === userId
                  ? "flex gap-3 flex-row-reverse"
                  : "flex gap-3"
              }
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message?.sender?.image} />
                <AvatarFallback>{message?.sender?.name}</AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-background dark:bg-zinc-700 py-2 px-4 max-w-[70%]">
                {message.image && (
                  <div className="w-80 h-52 flex items-center justify-center py-4 my-2 relative">
                    <Image
                      src={message?.image}
                      alt="Message Image"
                      layout="fill"
                      objectFit="cover"
                      quality={50}
                      className="rounded-lg"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <p className="text-base text-zinc-600 dark:text-zinc-300">
                    {message?.body}
                  </p>
                  <p className="text-sm text-muted-foreground self-start">
                    {formatDate3(message?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className="flex flex-col p-3">
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
              className="absolute top-2 right-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
              onClick={removeSelectedImage}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
        <div className="flex flex-row">
          <div className="flex flex-row">
            <Button
              size="icon"
              variant="secondary"
              className="hover:bg-primary-foreground rounded-full"
            >
              <CirclePlus className="h-5 w-5 text-violet-500 " />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="hover:bg-primary-foreground rounded-full"
              onClick={handleImageButtonClick}
            >
              <ImageIcon className="h-5 w-5 text-violet-500 " />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              size="icon"
              variant="secondary"
              className="hover:bg-primary-foreground rounded-full"
            >
              <Sticker className="h-5 w-5 text-violet-500 " />
            </Button>
          </div>
          <div className="flex gap-2 flex-grow relative px-1">
            <Input
              placeholder="Type a message..."
              className="flex-1 rounded-full"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <SmilePlus className="h-5 w-5 text-violet-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="hover:bg-primary-foreground rounded-full"
            onClick={handleSendMessage}
          >
            {inputMessage.trim() !== "" || selectedImage ? (
              <Send className="h-5 w-5 text-violet-500" />
            ) : (
              <ThumbsUp className="h-5 w-5 text-violet-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
