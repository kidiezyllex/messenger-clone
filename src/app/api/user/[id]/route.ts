import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const user = await prismadb.user.findUnique({
      where: {
        email: params.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        messages: true,
        seenMessages: true,
        sentMessages: true,
        conversations: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}
