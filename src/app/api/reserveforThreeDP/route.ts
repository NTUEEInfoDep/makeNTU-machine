import prisma from "../../../../prisma/client";
import { NextResponse, type NextRequest } from "next/server";

//POST
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { group, filename, loadBearing, material, comment } = data;
  try {
    const test = new Date();
    const user = await prisma.account.update({
      where: {
        name: group,
      },
      data: {
        ThreeDPReq: {
          create: {
            machine: 0,
            filename: filename,
            loadBearing: loadBearing,
            material: material,
            comment: comment,
            status: "等待確認",
            timeleft: test,
          },
        },
      },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// GET
export async function GET(req: NextRequest) {
  try {
    const dbresultReq = await prisma.threeDPReq.findMany({
      orderBy: [{ createAt: "desc" }],
    });
    return NextResponse.json({ dbresultReq }, { status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

//PUT
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { newStatus, newMachine, newTimeLeft } = data;
  const reqID = data.id;
  try {
    const result = await prisma.threeDPReq.update({
      where: {
        id: reqID,
      },
      data: {
        status: newStatus,
        machine: newMachine,
        timeleft: newTimeLeft,
      },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
