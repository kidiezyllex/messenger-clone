import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function GET() {
  try {
    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createAt: true,
        friends: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
