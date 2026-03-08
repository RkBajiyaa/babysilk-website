import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, desc, sql, count, sum } from "drizzle-orm";
import {
  products, orders, orderItems,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(process.env.DATABASE_URL);

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;

  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderByIdAndPhone(orderId: string, phone: string): Promise<{ order: Order; items: OrderItem[] } | undefined>;
  getOrderById(orderId: string): Promise<Order | undefined>;
  updateOrderPayment(orderId: string, data: { upiTransactionId?: string; paymentStatus?: string }): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, data: { orderStatus?: string; notes?: string }): Promise<Order | undefined>;
  getAllOrders(): Promise<(Order & { items: OrderItem[] })[]>;
  getOrderStats(): Promise<{ totalOrders: number; pendingPayments: number; todayOrders: number; totalRevenue: number }>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(products.id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return result[0];
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    if (items.length > 0) {
      await db.insert(orderItems).values(items.map(item => ({ ...item, orderId: newOrder.orderId })));
    }
    return newOrder;
  }

  async getOrderByIdAndPhone(orderId: string, phone: string): Promise<{ order: Order; items: OrderItem[] } | undefined> {
    const [order] = await db.select().from(orders).where(and(eq(orders.orderId, orderId), eq(orders.phone, phone))).limit(1);
    if (!order) return undefined;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    return { order, items };
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
    return order;
  }

  async updateOrderPayment(orderId: string, data: { upiTransactionId?: string; paymentStatus?: string }): Promise<Order | undefined> {
    const updateData: any = {};
    if (data.upiTransactionId) updateData.upiTransactionId = data.upiTransactionId;
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;

    const [updated] = await db.update(orders).set(updateData).where(eq(orders.orderId, orderId)).returning();
    return updated;
  }

  async updateOrderStatus(orderId: string, data: { orderStatus?: string; notes?: string }): Promise<Order | undefined> {
    const updateData: any = {};
    if (data.orderStatus) updateData.orderStatus = data.orderStatus;
    if (data.notes !== undefined) updateData.notes = data.notes;

    if (data.orderStatus === "payment_received") {
      updateData.paymentStatus = "payment_received";
    }

    const [updated] = await db.update(orders).set(updateData).where(eq(orders.orderId, orderId)).returning();
    return updated;
  }

  async getAllOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const result = [];
    for (const order of allOrders) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.orderId));
      result.push({ ...order, items });
    }
    return result;
  }

  async getOrderStats(): Promise<{ totalOrders: number; pendingPayments: number; todayOrders: number; totalRevenue: number }> {
    const [totalResult] = await db.select({ count: count() }).from(orders);
    const [pendingResult] = await db.select({ count: count() }).from(orders).where(eq(orders.paymentStatus, "payment_verification_pending"));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [todayResult] = await db.select({ count: count() }).from(orders).where(
      sql`${orders.createdAt} >= ${today}`
    );

    const [revenueResult] = await db.select({ total: sum(orders.totalAmount) }).from(orders).where(
      sql`${orders.paymentStatus} != 'pending'`
    );

    return {
      totalOrders: totalResult?.count || 0,
      pendingPayments: pendingResult?.count || 0,
      todayOrders: todayResult?.count || 0,
      totalRevenue: Number(revenueResult?.total) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
