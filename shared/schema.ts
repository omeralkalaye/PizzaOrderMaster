import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pizzas = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  imageUrl: text("image_url").notNull(),
  available: boolean("available").notNull().default(true),
});

export const toppings = pgTable("toppings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Additional price in cents
});

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  items: jsonb("items").notNull(), // Array of pizza IDs and quantities
  status: text("status").notNull(),
  total: integer("total").notNull(), // Total in cents
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPizzaSchema = createInsertSchema(pizzas).omit({ id: true });
export const insertToppingSchema = createInsertSchema(toppings).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });

export type Pizza = typeof pizzas.$inferSelect;
export type InsertPizza = z.infer<typeof insertPizzaSchema>;
export type Topping = typeof toppings.$inferSelect;
export type InsertTopping = z.infer<typeof insertToppingSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const orderItemSchema = z.object({
  pizzaId: z.number(),
  quantity: z.number().min(1),
  toppings: z.array(z.number()).optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
