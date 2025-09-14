import { NextRequest } from 'next/server';
import { User } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  status?: number;
}

export async function authMiddleware(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return { success: false, error: 'No token provided', status: 401 };
  }
  
  const user = await verifyToken(token);
  
  if (!user) {
    return { success: false, error: 'Invalid token', status: 401 };
  }
  
  return { success: true, user };
}
