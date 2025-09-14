import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * Auth Callback Route - Where Magic Link Users Land
 * 
 * What it does:
 * 1. User clicks magic link in email
 * 2. Supabase redirects them here with a special code
 * 3. We exchange that code for a real login session
 * 4. Redirect user to dashboard (or login page if failed)
 * 
 * Why we need it:
 * - Magic links need somewhere to "land" after email verification
 * - This completes the login process
 * - Without this, magic link auth won't work
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    // If no code provided, redirect to login
    if (!code) {
      return NextResponse.redirect(`${origin}/auth/login?error=No verification code provided`);
    }

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=Could not verify your email. Please try again.`);
    }

    // Success! User is now logged in
    if (data.user) {
      // Optional: Create user record in your database if needed
      // You can add logic here to create a user in your Prisma database
      
      console.log('User successfully logged in:', data.user.email);
      
      // Redirect to dashboard or intended page
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Fallback - shouldn't reach here
    return NextResponse.redirect(`${origin}/auth/login?error=Login completed but no user found`);

  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${origin}/auth/login?error=Something went wrong during login`);
  }
} 