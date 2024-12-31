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
    const friendRequests = await prismadb.friendRequest.findMany({
      where: {
        senderId: userId,
      },
      select: {
        receiver: {
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
      orderBy: {
        createdAt: "desc",
      },
    });
    const receivers = friendRequests.map((request) => request.receiver);

    return NextResponse.json(receivers);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
