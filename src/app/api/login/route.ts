import prismadb from "../../../../lib/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }
    const user = await prismadb.user.findUnique({
      where: { email },
    });
    if (!user || !user.hashedPassword) {
      return new NextResponse("Invalid email or password", { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return new NextResponse("Invalid email or password", { status: 401 });
    }
    const { hashedPassword, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
