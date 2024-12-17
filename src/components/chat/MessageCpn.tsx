import React from "react";
import { Message } from "../../../lib/entity-types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { formatDate3 } from "../../../lib/utils";

export default function MessageCpn({
  message,
  userId,
}: {
  message: Message;
  userId: string;
}) {
  return (
    <div
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
            {message?.text}
          </p>
          <p className="text-sm text-muted-foreground self-start">
            {formatDate3(message?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
