import { prisma } from "@/lib/prisma";
import { Buyer, Prisma } from "@prisma/client";

export async function getBuyers() {
  return prisma.buyer.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getBuyer(id: string) {
  return prisma.buyer.findUnique({ where: { id } });
}

export async function createBuyer(data: Prisma.BuyerCreateInput) {
  return prisma.buyer.create({ data });
}

export async function updateBuyer(id: string, data: Prisma.BuyerUpdateInput) {
  return prisma.buyer.update({ where: { id }, data });
}

export async function deleteBuyer(id: string) {
  return prisma.buyer.delete({ where: { id } });
}
