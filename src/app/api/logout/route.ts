import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 },
      );
    }

    await prisma.session.delete({
      where: {
        token: sessionToken,
      },
    });

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
