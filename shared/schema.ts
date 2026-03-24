import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  mrpPrice: integer("mrp_price").notNull(),
  discountPrice: integer("discount_price").notNull(),
  images: text("images").array().notNull(),
  sizes: text("sizes").array().notNull(),
  reviews: jsonb("reviews").notNull().$type<Review[]>(),
  bundleEligible: boolean("bundle_eligible").notNull().default(true),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  orderStatus: text("order_status").notNull().default("order_placed"),
  upiTransactionId: text("upi_transaction_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export interface Review {
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
  addressLine1: z.string().min(3, "Address is required"),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "Please select a state"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// UPDATED SIZE CHART WITH XS-XL
export const SIZE_CHART = [
  { label: "1-3 Months",  age: "1–3 mo",   chest: 38, length: 38 },
  { label: "3-6 Months",  age: "3–6 mo",   chest: 40, length: 42 },
  { label: "6-9 Months",  age: "6–9 mo",   chest: 42, length: 45 },
  { label: "9-12 Months", age: "9–12 mo",  chest: 44, length: 48 },
  { label: "1-2 Years",   age: "1–2 yrs",  chest: 48, length: 53 },
  { label: "2-3 Years",   age: "2–3 yrs",  chest: 52, length: 58 },
  { label: "3-4 Years",   age: "3–4 yrs",  chest: 56, length: 63 },
  { label: "4-5 Years",   age: "4–5 yrs",  chest: 60, length: 68 },
  { label: "5-6 Years",   age: "5–6 yrs",  chest: 64, length: 73 },
  { label: "6-7 Years",   age: "6–7 yrs",  chest: 68, length: 78 },
  { label: "7-8 Years",   age: "7–8 yrs",  chest: 72, length: 84 },
  { label: "8-10 Years",  age: "8–10 yrs", chest: 76, length: 90 },
  { label: "XS",  age: "~4–5 yrs", chest: 60, length: 70 },
  { label: "S",   age: "~5–6 yrs", chest: 64, length: 75 },
  { label: "M",   age: "~6–8 yrs", chest: 68, length: 82 },
  { label: "L",   age: "~8–10 yrs",chest: 74, length: 90 },
  { label: "XL",  age: "~10+ yrs", chest: 80, length: 98 },
];

export const CATEGORIES = [
  "Pattu Dresses",
  "Festive Wear",
  "Lehenga Sets",
  "Traditional Frocks",
  "Party Wear",
  "New Arrivals",
];

export const ORDER_STATUSES = [
  "order_placed",
  "payment_verification_pending",
  "payment_received",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;