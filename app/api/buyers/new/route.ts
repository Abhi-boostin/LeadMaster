import { NextRequest, NextResponse } from "next/server";
import { createBuyer } from "controllers/buyersController";
import { createBuyerSchema } from "lib/zodSchemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = createBuyerSchema.parse(body);

    const ownerId = "demo-user-id";

    const newBuyer = await createBuyer(validatedData, ownerId);

    return NextResponse.json({ success: true, buyer: newBuyer }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
} 