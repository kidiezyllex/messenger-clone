import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, friendId, isGroup, groupImage, members, name } = body;
    console.log(members);
    // Kiểm tra đầu vào cơ bản
    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }
    // Xử lý trường hợp là nhóm
    if (isGroup) {
      try {
        const newConversation = await prismadb.conversation.create({
          data: {
            name,
            isGroup,
            groupImage,
            users: {
              connect: [
                ...members.map((member: string) => ({ id: member })),
                { id: userId },
              ],
            },
            groupCreator: {
              connect: {
                id: userId,
              },
            },
          },
          include: {
            users: true,
          },
        });
        return NextResponse.json(newConversation);
      } catch (groupError) {
        console.error("Error creating group conversation:", groupError);
        return new NextResponse("Error creating group conversation", {
          status: 500,
        });
      }
    }

    // Kiểm tra nếu đã tồn tại hội thoại
    try {
      const existingConversations = await prismadb.conversation.findMany({
        where: {
          OR: [
            {
              usersIds: {
                equals: [userId, friendId],
              },
            },
            {
              usersIds: {
                equals: [friendId, userId],
              },
            },
          ],
        },
      });

      if (existingConversations.length > 0) {
        return NextResponse.json(existingConversations[0]);
      }
    } catch (findError) {
      console.error("Error finding existing conversations:", findError);
      return new NextResponse("Error checking for existing conversations", {
        status: 500,
      });
    }

    // Tạo hội thoại mới
    try {
      const newConversation = await prismadb.conversation.create({
        data: {
          users: {
            connect: [{ id: friendId }, { id: userId }],
          },
          usersIds: [userId, friendId],
          groupCreator: {
            connect: {
              id: userId,
            },
          },
          name: name || "",
        },
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    } catch (createError) {
      console.error("Error creating new conversation:", createError);
      return new NextResponse("Error creating new conversation", {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
