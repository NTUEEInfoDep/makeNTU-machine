import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../../../utils/env";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secretkey : string = process.env.PASSWORD_SECRET ? process.env.PASSWORD_SECRET : "Secret";
console.log("Account API Called");

export async function POST(req: NextRequest) {
    
    const data = await req.json();
    const { username, password, permission, login } = data;
    if (!login) {
        try {
            const existed = await prisma.account.findUnique({
                where: {
                    name: username,
                }
            });
            if(!existed) {
                const user = await prisma.account.create({
                    data: {
                        name: username,
                        password: password,
                        permission: permission,
                    }
                });
                const token = jwt.sign({username: user.name, permission: user.permission}, secretkey, {expiresIn: env.JWT_EXPIRES_IN});
                return NextResponse.json({ message: "OK", user: user, token: token }, {status: 200})
            } else {
                return NextResponse.json(
                    { error: "Account already existed" },
                    { status: 400 },
                );
            }
        } catch (error) {
            console.log("error: ", error);
            return NextResponse.json(
                { error: "Something went wrong" },
                { status: 500 },
            );
        }
    } else if (login) {
        try {
            const user = await prisma.account.findUnique({
                where: {
                    name: username,
                }
            });
            if(!user) {
                return NextResponse.json(
                     { error: "Account does not exist" },
                     { status: 400 },
                 );
            } else {
                const isPasswordValid = password === user.password ? true : false;
                if(isPasswordValid) {
                    const token = jwt.sign({username: user.name, permission: user.permission}, secretkey, {expiresIn: env.JWT_EXPIRES_IN});                    
                    return NextResponse.json({ message: "OK", user: user, token: token }, {status: 200})
                } else {
                    return NextResponse.json(
                        { error: "Incorrect Password" },
                        { status: 400 },
                    );
                }
            }
        } catch (error) {
            return NextResponse.json(
                { error: "Log in failed due to incorrect information" },
                { status: 500 }
            );
        }
    } else {
        console.log("idk how this could happen")
        return;
    }
}

export async function GET(req: NextRequest){
    try{
        const user = await prisma.account.findMany({
            select: {
                id: true,
                name: true,
                password: true,
                permission: true
            }
        });
        return NextResponse.json({user}, {status: 200});
    }catch(error){
        console.log("error: ", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const deleteUser = await prisma.account.deleteMany({
            where: {
                name: { not: "admin0" }
            }
        });
        return NextResponse.json({ message: "OK" }, { status: 200 });
    }
    catch(error) {
        console.log("error: ", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}