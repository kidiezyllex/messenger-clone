import prismadb from "../../../../lib/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    if (!email || !password || !name) {
      return new NextResponse("Missing info: ", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prismadb.user.create({
      data: { email, name, hashedPassword },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error: ", { status: 500 });
  }
}
