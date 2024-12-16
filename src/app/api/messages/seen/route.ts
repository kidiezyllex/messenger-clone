import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, messageId } = body;

  if (!userId || !messageId) {
    return NextResponse.json(
      { error: "User ID and Message ID are required" },
      { status: 400 }
    );
  }

  try {
    const updatedMessage = await prismadb.message.update({
      where: {
        id: messageId,
      },
      data: {
        seen: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        sender: true,
        seen: true,
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating seen status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
