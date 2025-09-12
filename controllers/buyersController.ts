import { prisma } from "@/lib/prisma";

export async function createBuyer(data: any, ownerId: string) {
  const newBuyer = await prisma.buyer.create({
    data: {
      ...data,
      ownerId,
      status: data.status || "New",
    },
  });

  await prisma.buyerHistory.create({
    data: {
      buyerId: newBuyer.id,
      changedBy: ownerId,
      diff: data,
    },
  });

  return newBuyer;
}

// List Buyers (with filters and search)
export const listBuyers = async (filters: any) => {
    const { q, status, city, skip = 0, take = 20 } = filters;
    const where: any = {};
    if (status) where.status = status;
    if (city) where.city = city;
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ];
    }
  
    const [items, total] = await Promise.all([
      prisma.buyer.findMany({ where, orderBy: { updatedAt: "desc" }, skip, take }),
      prisma.buyer.count({ where }),
    ]);
  
    return { items, total, skip, take };
  };

// Get Buyer by ID
export const getBuyer = async (id: string) => {
    const buyer = await prisma.buyer.findUnique({ where: { id } });
    return buyer;
  };    

// Update Buyer
export const updateBuyer = async (id: string, data: any) => {
    const updated = await prisma.buyer.update({ where: { id }, data });
    return updated;
  };
  
// Delete Buyer
export const deleteBuyer = async (id: string) => {
    await prisma.buyer.delete({ where: { id } });
    return true;
  };