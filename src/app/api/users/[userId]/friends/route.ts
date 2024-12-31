import { NextResponse } from "next/server";
import prismadb from "../../../../../../lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const friends = await prismadb.friend.findMany({
      where: { userId: userId },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createAt: true,
            friends: true,
          },
        },
      },
    });

    const friendList = friends.map((friend) => friend.friend);

    return NextResponse.json(friendList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
