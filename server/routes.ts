import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkoutFormSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";

function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "BSK-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

function calculateServerBundlePrice(items: { price: number; quantity: number }[]): number {
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const bundles = Math.floor(totalCount / 3);
  const remaining = totalCount % 3;

  const allPrices = items.flatMap(i => Array(i.quantity).fill(i.price)).sort((a: number, b: number) => b - a);

  const bundleTotal = bundles * 1550;
  const remainingTotal = allPrices.slice(bundles * 3).reduce((s: number, p: number) => s + p, 0);

  return bundleTotal + remainingTotal;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "babysilk-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
  );

  app.post("/api/orders", async (req, res) => {
    try {
      const { items, totalAmount, ...customerData } = req.body;

      const validated = checkoutFormSchema.parse(customerData);

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "No items in order" });
      }

      const serverTotal = calculateServerBundlePrice(items);

      const orderId = generateOrderId();
      const order = await storage.createOrder(
        {
          orderId,
          customerName: validated.customerName,
          phone: validated.phone,
          email: validated.email || null,
          addressLine1: validated.addressLine1,
          addressLine2: validated.addressLine2 || null,
          city: validated.city,
          state: validated.state,
          pincode: validated.pincode,
          totalAmount: serverTotal,
          paymentStatus: "pending",
          orderStatus: "order_placed",
          upiTransactionId: null,
          notes: null,
        },
        items.map((item: any) => ({
          orderId,
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      res.json(order);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
      }
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:orderId/payment", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { upiTransactionId, paymentStatus } = req.body;

      const updated = await storage.updateOrderPayment(orderId, {
        upiTransactionId,
        paymentStatus: paymentStatus || "payment_verification_pending",
      });

      if (!updated) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updated);
    } catch (error: any) {
      console.error("Payment update error:", error);
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  app.get("/api/orders/track", async (req, res) => {
    try {
      const { orderId, phone } = req.query as { orderId: string; phone: string };
      if (!orderId || !phone) {
        return res.status(400).json({ message: "Order ID and phone are required" });
      }

      const result = await storage.getOrderByIdAndPhone(orderId, phone);
      if (!result) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        orderId: result.order.orderId,
        customerName: result.order.customerName,
        orderStatus: result.order.orderStatus,
        paymentStatus: result.order.paymentStatus,
        totalAmount: result.order.totalAmount,
        createdAt: result.order.createdAt,
        city: result.order.city,
        state: result.order.state,
        items: result.items,
      });
    } catch (error: any) {
      console.error("Track order error:", error);
      res.status(500).json({ message: "Failed to track order" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "BSKAdmin2024";
    if (password === adminPassword) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const allOrders = await storage.getAllOrders();
      res.json(allOrders);
    } catch (error: any) {
      console.error("Admin orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.patch("/api/admin/orders/:orderId", requireAdmin, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { orderStatus, notes } = req.body;

      const updated = await storage.updateOrderStatus(orderId, { orderStatus, notes });
      if (!updated) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updated);
    } catch (error: any) {
      console.error("Admin order update error:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  return httpServer;
}
