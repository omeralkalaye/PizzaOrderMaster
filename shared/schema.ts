import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type PizzaSize = "S" | "M" | "L" | "XL";
export type DeliveryType = "delivery" | "pickup";
export type ToppingLayout = "full" | "half" | "quarter";

export const pizzaSizes = {
  S: { name: "S", priceMultiplier: 1 },
  M: { name: "M", priceMultiplier: 1.2 },
  L: { name: "L", priceMultiplier: 1.4 },
  XL: { name: "XL", priceMultiplier: 1.6 }
};

export const pizzas = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Base price in cents
  imageUrl: text("image_url").notNull(),
  available: boolean("available").notNull().default(true),
});

export const toppings = pgTable("toppings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Additional price in cents
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
});

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

// Schema for topping selection in a specific section
export const sectionToppingsSchema = z.array(z.number()).max(3);

// Schema for topping layout selection
export const toppingLayoutSchema = z.object({
  layout: z.enum(["full", "half", "quarter"]),
  sections: z.array(sectionToppingsSchema)
    .min(1)
    .max(4), // 1 section for full, 2 for half, 4 for quarter
});

export const pizzaOrderItemSchema = z.object({
  pizzaId: z.number(),
  size: z.enum(["S", "M", "L", "XL"]),
  quantity: z.number().min(1),
  toppingLayout: toppingLayoutSchema,
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  address: text("address"),
  phone: text("phone").notNull(),
  deliveryType: text("delivery_type").notNull(),
  items: jsonb("items").notNull(), // Array of pizza order items
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
export type PizzaOrderItem = z.infer<typeof pizzaOrderItemSchema>;