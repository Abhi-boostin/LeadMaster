import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const supabase = getSupabaseServerClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during sign out:", error.message);
    }
  } catch (err) {
    console.error("Sign out exception:", err);
  }

  const url = new URL(request.url);
  return NextResponse.redirect(`${url.origin}/auth/login`);
} 