import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";
import { pusherServer } from "@/lib/pusher";

export async function GET(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    const message = await prismadb.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
        seen: true,
        conversation: true,
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;
  const body = await req.json();
  const { content, type } = body;

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedMessage = await prismadb.message.update({
      where: {
        id: messageId,
      },
      data: {
        text: content,
        type: type,
      },
      include: {
        sender: true,
        seen: true,
      },
    });
    await pusherServer.trigger(messageId, "message:revoke", updatedMessage);
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    await prismadb.message.delete({
      where: {
        id: messageId,
      },
    });

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
