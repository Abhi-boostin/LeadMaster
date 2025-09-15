// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const supabase = getSupabaseServerClient()

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=No verification code provided`)
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Could not verify your email`)
  }

  if (data.user) {
    // ✅ session cookies are now set
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Login completed but no user found`)
}
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams, origin } = new URL(request.url);
//     const code = searchParams.get('code');
//     const next = searchParams.get('next') ?? '/dashboard';

//     if (!code) {
//       return NextResponse.redirect(`${origin}/auth/login?error=No verification code provided`);
//     }

//     const { data, error } = await supabase.auth.exchangeCodeForSession(code);

//     if (error) {
//       return NextResponse.redirect(`${origin}/auth/login?error=Could not verify your email. Please try again.`);
//     }

//     if (data.user) {
//       return NextResponse.redirect(`${origin}${next}`);
//     }

//     return NextResponse.redirect(`${origin}/auth/login?error=Login completed but no user found`);
//   } catch (error) {
//     return NextResponse.redirect(`${origin}/auth/login?error=Something went wrong during login`);
//   }
// } 