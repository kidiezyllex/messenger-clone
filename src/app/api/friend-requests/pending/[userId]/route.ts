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
        receiverId: userId,
        status: "pending",
      },
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const senders = friendRequests.map((request) => ({
      ...request.sender,
      friendRequestId: request.id,
    }));

    return NextResponse.json(senders);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
