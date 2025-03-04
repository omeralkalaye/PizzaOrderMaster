import { Express } from "express";
import { orders } from "../shared/schema";
import { db } from "./db";

export function registerRoutes(app: Express) {
  // Orders API
  app.post("/api/orders", async (req, res) => {
    try {
      const [order] = await db.insert(orders).values(req.body).returning();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const allOrders = await db.select().from(orders);
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
}
