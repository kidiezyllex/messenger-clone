import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, isGroup, members } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isGroup && (!members || members.length < 2)) {
      return NextResponse.json(
        { error: "Invalid group members" },
        { status: 400 }
      );
    }

    const conversation = await prismadb.conversation.create({
      data: {
        name,
        isGroup,
        users: {
          connect: [
            ...members.map((member: string) => ({ id: member })),
            { id: userId },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.log(error, "ERROR_CONVERSATIONS");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
