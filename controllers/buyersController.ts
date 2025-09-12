import { prisma } from "lib/prisma";

// Create Buyer
export const createBuyer = async (data: any, ownerId: string) => {
  const newBuyer = await prisma.buyer.create({
    data: {
      ...data,
      ownerId,
    },
  });
  return newBuyer;
};