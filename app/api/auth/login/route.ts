import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "http://localhost:3000/dashboard", // adjust in prod
    },
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}
