// app/api/buyers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient";
import { createBuyerSchema } from "@/lib/zodSchemas";

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Get logged-in user from Supabase session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Fetch all buyers regardless of owner
    const buyers = await prisma.buyer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, items: buyers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get logged-in user from Supabase session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Validate request body
    const body = await req.json();
    const validatedData = createBuyerSchema.parse(body);

    // 3️⃣ Create buyer in DB with ownerId = logged-in user
    const newBuyer = await prisma.buyer.create({
      data: {
        ...validatedData,
        ownerId: user.id,
      },
    });

    return NextResponse.json({ success: true, buyer: newBuyer }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
