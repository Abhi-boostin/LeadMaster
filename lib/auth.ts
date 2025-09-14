import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Auth Utility - Helper Functions for Authentication
 * 
 * What it is:
 * - A collection of useful functions for handling user authentication
 * - Makes it easy to check if someone is logged in
 * - Provides consistent ways to get user information
 * 
 * Why we need it:
 * - Avoid writing the same auth code over and over
 * - Keep all auth logic in one place
 * - Make it easy to use in different parts of your app
 */

/**
 * Get current user from Supabase session
 * @returns User object or null if not logged in
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is currently logged in
 * @returns true if logged in, false otherwise
 */
export async function isLoggedIn() {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Get user ID from request headers (set by middleware)
 * @param request - Next.js request object
 * @returns User ID string
 */
export function getUserIdFromRequest(request: Request): string {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    throw new Error('User ID not found in request headers');
  }
  return userId;
}

/**
 * Get user email from request headers (set by middleware)
 * @param request - Next.js request object
 * @returns User email string
 */
export function getUserEmailFromRequest(request: Request): string {
  return request.headers.get('x-user-email') || '';
}

/**
 * Sign out current user
 * @returns Promise that resolves when sign out is complete
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

/**
 * Refresh user session
 * @returns Updated user object or null if refresh failed
 */
export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error || !session) {
      return null;
    }
    
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.email
    };
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
} 