import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  const { conversationId, senderId, content } = body;

  if (!conversationId || !senderId || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const message = await prismadb.message.create({
      data: {
        body: content,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: senderId },
        },
      },
      include: {
        sender: true,
        seen: true,
      },
    });

    // Update the conversation's lastMessageAt
    await prismadb.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
      },
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  try {
    const messages = await prismadb.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
