import { NextRequest, NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { createBuyerSchema } from "lib/zodSchemas";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const buyer = await prisma.buyer.findUnique({ where: { id: params.id } });
    if (!buyer) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, buyer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validated = createBuyerSchema.partial().parse(body);

    const updated = await prisma.buyer.update({ where: { id: params.id }, data: validated });
    return NextResponse.json({ success: true, buyer: updated });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.buyer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
} 