import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertPizzaSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Pizza routes
  app.get("/api/pizzas", async (_req, res) => {
    const pizzas = await storage.getPizzas();
    res.json(pizzas);
  });

  app.get("/api/pizzas/:id", async (req, res) => {
    const pizza = await storage.getPizza(Number(req.params.id));
    if (!pizza) return res.status(404).json({ message: "פיצה לא נמצאה" });
    res.json(pizza);
  });

  app.post("/api/pizzas", async (req, res) => {
    const result = insertPizzaSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "נתוני פיצה לא תקינים" });
    }
    const pizza = await storage.createPizza(result.data);
    res.status(201).json(pizza);
  });

  app.patch("/api/pizzas/:id", async (req, res) => {
    const result = insertPizzaSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "נתוני פיצה לא תקינים" });
    }
    const pizza = await storage.updatePizza(Number(req.params.id), result.data);
    if (!pizza) return res.status(404).json({ message: "פיצה לא נמצאה" });
    res.json(pizza);
  });

  // Topping routes
  app.get("/api/toppings", async (_req, res) => {
    const toppings = await storage.getToppings();
    res.json(toppings);
  });

  app.get("/api/toppings/:id", async (req, res) => {
    const topping = await storage.getTopping(Number(req.params.id));
    if (!topping) return res.status(404).json({ message: "תוספת לא נמצאה" });
    res.json(topping);
  });

  // Order routes
  app.get("/api/orders", async (_req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    const result = insertOrderSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "נתוני הזמנה לא תקינים" });
    }
    const order = await storage.createOrder(result.data);
    res.status(201).json(order);
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    const result = z.object({ status: z.enum(["pending", "preparing", "ready", "delivered"]) }).safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "סטטוס לא תקין" });
    }
    const order = await storage.updateOrderStatus(Number(req.params.id), result.data.status);
    if (!order) return res.status(404).json({ message: "הזמנה לא נמצאה" });
    res.json(order);
  });

  const httpServer = createServer(app);
  return httpServer;
}