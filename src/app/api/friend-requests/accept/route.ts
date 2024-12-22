import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { friendRequestId, userId } = body;

    if (!friendRequestId || !userId) {
      return NextResponse.json(
        { error: "Friend request ID and user ID are required" },
        { status: 400 }
      );
    }

    // Update the friend request status
    const updatedFriendRequest = await prismadb.friendRequest.update({
      where: { id: friendRequestId, receiverId: userId },
      data: { status: "accepted" },
    });

    if (!updatedFriendRequest) {
      return NextResponse.json(
        {
          error:
            "Friend request not found or you're not authorized to accept it",
        },
        { status: 404 }
      );
    }

    // Create friend relationships
    await prismadb.friend.createMany({
      data: [
        {
          userId: updatedFriendRequest.senderId,
          friendId: updatedFriendRequest.receiverId,
        },
        {
          userId: updatedFriendRequest.receiverId,
          friendId: updatedFriendRequest.senderId,
        },
      ],
    });

    return NextResponse.json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
