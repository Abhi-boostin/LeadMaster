import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabaseClient";
import { createBuyerSchema } from "@/lib/zodSchemas";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

    // 1️⃣ Get logged-in user from Supabase session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Fetch all buyers (or later filter by ownerId = user.id)
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
    const supabase = getSupabaseServerClient();

    // 1️⃣ Get logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Validate request body
    const body = await req.json();
    const validatedData = createBuyerSchema.parse(body);

    // 3️⃣ Create buyer with ownerId = logged-in user
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
