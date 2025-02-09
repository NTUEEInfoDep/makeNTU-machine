import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "@/utils/env";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const secretkey: string = process.env.PASSWORD_SECRET
  ? process.env.PASSWORD_SECRET
  : "Secret";
console.log("Account API Called");

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { username, password, permission, login } = data;
  if (!login) {
    try {
      const existed = await prisma.account.findUnique({
        where: {
          name: username,
        },
      });
      if (!existed) {
        const user = await prisma.account.create({
          data: {
            name: username,
            password: password,
            permission: permission,
          },
        });
        const token = jwt.sign(
          { username: user.name, permission: user.permission },
          secretkey,
          { expiresIn: env.JWT_EXPIRES_IN },
        );
        return NextResponse.json(
          { message: "OK", user: user, token: token },
          { status: 200 },
        );
      } else {
        return NextResponse.json({ error: "帳號以註冊" }, { status: 400 });
      }
    } catch (error) {
      console.log("error: ", error);
      return NextResponse.json({ error: "發生了一些錯誤" }, { status: 500 });
    }
  } else if (login) {
    try {
      const user = await prisma.account.findUnique({
        where: {
          name: username,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "使用者不存在" }, { status: 404 });
      } else {
        const isPasswordValid = password === user.password ? true : false;
        if (isPasswordValid) {
          // Check for existing session
          const existingSession = await prisma.session.findFirst({
            where: {
              userId: user.id,
            },
          });

          if (existingSession) {
            return NextResponse.json(
              { error: "此帳號已在其他地方登入" },
              { status: 400 },
            );
          }

          // Create a new session
          const sessionToken = uuidv4();
          await prisma.session.create({
            data: {
              userId: user.id,
              token: sessionToken,
            },
          });

          const token = jwt.sign(
            { username: user.name, permission: user.permission },
            secretkey,
            { expiresIn: env.JWT_EXPIRES_IN },
          );
          return NextResponse.json(
            {
              message: "OK",
              user: user,
              token: token,
              sessionToken: sessionToken,
            },
            { status: 200 },
          );
        } else {
          return NextResponse.json({ error: "密碼錯誤" }, { status: 400 });
        }
      }
    } catch (error) {
      return NextResponse.json({ error: "伺服器內部問題" }, { status: 500 });
    }
  } else {
    console.log("我不知道為什麼");
    return;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        password: true,
        permission: true,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ error: "發生了一些錯誤" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const deleteUser = await prisma.account.deleteMany({
      where: {
        name: { not: "0" },
      },
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ error: "發生了一些錯誤" }, { status: 500 });
  }
}
