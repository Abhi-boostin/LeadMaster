import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Auth Middleware - Security Guard for API Routes
 * 
 * What it does:
 * 1. Checks if user has valid token
 * 2. If no token → Block access (401 Unauthorized)
 * 3. If valid token → Allow access + add user info to request
 * 
 * Why we need it:
 * - Prevents random people from accessing your API
 * - Ensures only logged-in users can create/see buyers
 * - Adds user ID to every request so you know who's making the call
 */
export async function authMiddleware(request) {
  try {
    // Get the token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // If no token provided, block access
    if (!token) {
      return {
        success: false,
        error: 'No authentication token provided',
        status: 401
      };
    }
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    // If token is invalid or expired
    if (error || !user) {
      return {
        success: false,
        error: 'Invalid or expired token',
        status: 401
      };
    }
    
    // If everything is good, return user info
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email
      }
    };
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

/**
 * Helper function to use in API routes
 * 
 * Example usage:
 * const authResult = await authMiddleware(request);
 * if (!authResult.success) {
 *   return NextResponse.json({ error: authResult.error }, { status: authResult.status });
 * }
 * const userId = authResult.user.id;
 */
export function createAuthResponse(error, status = 401) {
  return {
    success: false,
    error,
    status
  };
} 