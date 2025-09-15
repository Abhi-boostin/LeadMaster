// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? '/dashboard';

    if (!code) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=No verification code provided`
      );
    }

    // 1️⃣ Exchange code for session
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=Could not verify your email`
      );
    }

    const user = data.user;

    // 2️⃣ Upsert the user into your Prisma User table
    await prisma.user.upsert({
      where: { id: user.id }, // Use Supabase user.id as your primary key
      update: {},             // Do nothing if user already exists
      create: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null
      }
    });

    // 3️⃣ Redirect to dashboard (session cookies are already set by Supabase)
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  } catch (err) {
    console.error('Callback error:', err);
    const requestUrl = new URL(request.url);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=Something went wrong during login`
    );
  }
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