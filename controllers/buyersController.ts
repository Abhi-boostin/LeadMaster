import { prisma } from "../lib/prisma";

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