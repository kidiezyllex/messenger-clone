import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const friendRequests = await prismadb.friendRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return NextResponse.json(friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { senderId, receiverId } = body;

  if (!senderId || !receiverId) {
    return NextResponse.json(
      { error: "Sender ID and Receiver ID are required" },
      { status: 400 }
    );
  }

  try {
    const newFriendRequest = await prismadb.friendRequest.create({
      data: { senderId, receiverId },
    });

    return NextResponse.json(newFriendRequest);
  } catch (error) {
    console.error("Error creating friend request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { error: "Friend Request ID and status are required" },
      { status: 400 }
    );
  }

  try {
    const updatedFriendRequest = await prisma.friendRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "accepted") {
      await prisma.friend.createMany({
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
    }

    return NextResponse.json(updatedFriendRequest);
  } catch (error) {
    console.error("Error updating friend request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Friend Request ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.friendRequest.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Friend request cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
