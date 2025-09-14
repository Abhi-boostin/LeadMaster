import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "@/app/api/auth/middlewares/authmiddlewares";

export async function GET(req: NextRequest) {
  try {
    // 🔒 SECURITY CHECK - Must be logged in
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error }, 
        { status: authResult.status }
      );
    }

    // ✅ User is authenticated, get their ID
    const userId = authResult.user.id;
    
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;
    const city = searchParams.get("city") || undefined;
    const take = Number(searchParams.get("take") || 20);
    const skip = Number(searchParams.get("skip") || 0);
    
    // 🔒 Only show this user's buyers
    const where: any = {
      ownerId: userId, // This ensures user only sees their own data
    };
    
    if (status) where.status = status as any;
    if (city) where.city = city as any;
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.buyer.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
      prisma.buyer.count({ where }),
    ]);

    return NextResponse.json({ success: true, items, total, skip, take });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
} 