import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    conversationId,
    image,
    file,
    fileName,
    content,
    senderId,
    type,
    replyMessageId,
    replyText,
    taggedUsers,
  } = body;

  if (!conversationId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const messageData: any = {
      type: type,
      text: content,
      image: image,
      file: file,
      fileName: fileName,
      taggedUsers: taggedUsers,
      conversation: {
        connect: { id: conversationId },
      },
      sender: {
        connect: { id: senderId },
      },
      seen: {
        connect: { id: senderId },
      },
    };

    if (replyMessageId) {
      messageData.replyTo = {
        connect: { id: replyMessageId },
      };
      messageData.replyText = replyText;
    }
    const message = await prismadb.message.create({
      data: messageData,
      include: {
        sender: true,
        seen: true,
        replyTo: true,
      },
    });
    
    await prismadb.$transaction([
      prismadb.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageAt: new Date(),
          messages: {
            connect: {
              id: message.id,
            },
          },
        },
        include: {
          users: true,
          messages: {
            include: {
              seen: true,
            },
          },
        },
      }),
      prismadb.user.update({
        where: {
          id: senderId,
        },
        data: {
          lastConversationId: conversationId,
        },
      }),
    ]);

    try {
      await pusherServer.trigger(conversationId, "message:new", message);
    } catch (pusherError) {
      console.error("Error triggering Pusher event:", pusherError);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error", pusherStatus: "error" },
      { status: 500 }
    );
  }
}
