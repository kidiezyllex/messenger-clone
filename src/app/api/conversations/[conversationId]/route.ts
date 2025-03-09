import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";
import { pusherServer } from "@/lib/pusher";

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  try {
    const conversation = await prismadb.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        groupCreator: true,
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        pinnedMessages: {
          include: {
            sender: true,
            seen: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params;
    const body = await request.json();
    const { action, message } = body;

    if (!action || !message || (action !== "pin" && action !== "unpin")) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const conversation = await prismadb.conversation.findUnique({
      where: { id: conversationId },
      include: { pinnedMessages: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    let updatedPinnedMessages;

    if (action === "pin") {
      const isAlreadyPinned = conversation.pinnedMessages.some(
        (pinnedMessage) => pinnedMessage.id === message.id
      );

      if (!isAlreadyPinned) {
        updatedPinnedMessages = {
          connect: { id: message.id },
        };
        await pusherServer.trigger(conversationId, "message:pin", message);
      } else {
        return NextResponse.json(
          { message: "Message is already pinned" },
          { status: 200 }
        );
      }
    } else {
      // Unpin the message
      updatedPinnedMessages = {
        disconnect: { id: message.id },
      };
    }

    const updatedConversation = await prismadb.conversation.update({
      where: { id: conversationId },
      data: {
        pinnedMessages: updatedPinnedMessages,
      },
      include: { pinnedMessages: true },
    });

    return NextResponse.json(updatedConversation, { status: 200 });
  } catch (error) {
    console.error("Error updating pinned messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const { conversationId } = params;

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  try {
    await prismadb.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}