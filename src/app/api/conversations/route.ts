import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, friendId, isGroup, members, name } = body;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prismadb.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: userId,
              },
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
    }

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

    const singleConversation = existingConversations[0];
    console.log(singleConversation);
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prismadb.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: friendId,
            },
            {
              id: userId,
            },
          ],
        },
        usersIds: [userId, friendId],
        groupCreator: {
          connect: {
            id: userId,
          },
        },
        name: name,
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
