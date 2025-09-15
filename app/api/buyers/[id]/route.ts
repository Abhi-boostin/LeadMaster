// app/api/buyers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createBuyerSchema } from "@/lib/zodSchemas";
import { getBuyer, updateBuyer, deleteBuyer } from "@/controllers/buyersController";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const buyer = await getBuyer(params.id);

    if (!buyer || buyer.ownerId !== user.id) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, buyer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const existingBuyer = await getBuyer(params.id);
    if (!existingBuyer || existingBuyer.ownerId !== user.id) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = createBuyerSchema.partial().parse(body);

    const updated = await updateBuyer(params.id, validated);

    return NextResponse.json({ success: true, buyer: updated });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const existingBuyer = await getBuyer(params.id);
    if (!existingBuyer || existingBuyer.ownerId !== user.id) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    await deleteBuyer(params.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
