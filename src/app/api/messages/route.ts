import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  const { conversationId, image, content, senderId, type } = body;

  if (!conversationId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const message = await prismadb.message.create({
      data: {
        type: type,
        text: content,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: senderId },
        },
        seen: {
          connect: { id: senderId },
        },
      },
      include: {
        sender: true,
        seen: true,
      },
    });
    // Update the conversation's lastMessageAt and the user's lastConversationId
    const [updatedConversation, updatedUser] = await prismadb.$transaction([
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

    await pusherServer.trigger(conversationId, "message:new", message);
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        message: [lastMessage],
      });
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
