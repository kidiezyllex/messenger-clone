import { NextResponse } from "next/server";
import prismadb from "../../../../../../lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prismadb.conversation.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.log(error, "ERROR_CONVERSATIONS");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
