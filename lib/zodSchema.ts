import { z } from "zod";

/**
 * Enums from assignment
 */
export const cityEnum = z.enum([
  "Chandigarh",
  "Mohali",
  "Zirakpur",
  "Panchkula",
  "Other",
]);

export const propertyTypeEnum = z.enum([
  "Apartment",
  "Villa",
  "Plot",
  "Office",
  "Retail",
]);

export const bhkEnum = z.enum(["1", "2", "3", "4", "Studio"]);

export const purposeEnum = z.enum(["Buy", "Rent"]);

export const timelineEnum = z.enum(["0-3m", "3-6m", ">6m", "Exploring"]);

export const sourceEnum = z.enum([
  "Website",
  "Referral",
  "Walk-in",
  "Call",
  "Other",
]);

export const statusEnum = z.enum([
  "New",
  "Qualified",
  "Contacted",
  "Visited",
  "Negotiation",
  "Converted",
  "Dropped",
]);

/**
 * Base Buyer schema (all fields)
 */
export const buyerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(80, "Full Name cannot exceed 80 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone must be numeric")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits"),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional(), // conditional validation applied later
  purpose: purposeEnum,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
  tags: z.array(z.string()).optional(),
  status: statusEnum.optional(), // default handled in API
});

/**
 * Create/Update Buyer schema with conditional rules
 */
export const createBuyerSchema = buyerSchema
  // bhk is required if propertyType is Apartment or Villa
  .refine(
    (data) => {
      if (["Apartment", "Villa"].includes(data.propertyType)) {
        return !!data.bhk;
      }
      return true; // optional for other property types
    },
    {
      message: "BHK is required for Apartment or Villa",
      path: ["bhk"],
    }
  )
  // budgetMax must be >= budgetMin
  .refine(
    (data) => {
      if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
        return data.budgetMax >= data.budgetMin;
      }
      return true;
    },
    {
      message: "budgetMax must be greater than or equal to budgetMin",
      path: ["budgetMax"],
    }
  );
