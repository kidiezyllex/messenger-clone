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

        <div className="flex flex-col gap-2">
          <p className="text-base text-zinc-600 dark:text-zinc-300">
            {message?.text}
          </p>
          <p className="text-xs text-muted-foreground self-end">
            {formatDate3(message?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
