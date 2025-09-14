import { NextRequest, NextResponse } from "next/server";
import { createBuyer } from "@/controllers/buyersController";
import { createBuyerSchema } from "@/lib/zodSchemas";

export async function POST(req: NextRequest) {
  try {
    // Get user ID from middleware headers
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const validatedData = createBuyerSchema.parse(body);

    const newBuyer = await createBuyer(validatedData, userId);

    return NextResponse.json({ success: true, buyer: newBuyer }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
