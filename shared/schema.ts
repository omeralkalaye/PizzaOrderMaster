import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export type PizzaSize = "S" | "M" | "L" | "XL";
export type DeliveryType = "delivery" | "pickup";
export type ToppingLayout = "full" | "half" | "quarter";

export const pizzaSizes = {
  S: { name: "S", priceMultiplier: 1 },
  M: { name: "M", priceMultiplier: 1.2 },
  L: { name: "L", priceMultiplier: 1.4 },
  XL: { name: "XL", priceMultiplier: 1.6 }
};

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  defaultAddress: text("default_address"),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payment methods schema
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cardLastFourDigits: varchar("card_last_four_digits", { length: 4 }).notNull(),
  cardType: varchar("card_type", { length: 50 }).notNull(),
  expiryMonth: varchar("expiry_month", { length: 2 }).notNull(),
  expiryYear: varchar("expiry_year", { length: 2 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

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
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  address: text("address"),
  phone: text("phone").notNull(),
  deliveryType: text("delivery_type").notNull(),
  items: jsonb("items").notNull(), // Array of pizza order items
  status: text("status").notNull(),
  total: integer("total").notNull(), // Total in cents
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  paymentMethods: many(paymentMethods),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertPizzaSchema = createInsertSchema(pizzas).omit({ id: true });
export const insertToppingSchema = createInsertSchema(toppings).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders)
  .omit({ id: true, createdAt: true })
  .extend({
    deliveryType: z.enum(["delivery", "pickup"]),
    address: z.string().optional().refine(
      (address) => {
        if (address === undefined) return true;
        return address.length >= 5;
      },
      { message: "נא להזין כתובת מלאה למשלוח" }
    ),
  });

// User related schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
    email: z.string().email("כתובת אימייל לא תקינה"),
    phone: z.string().min(10, "מספר טלפון לא תקין"),
  });

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods)
  .omit({ id: true })
  .extend({
    cardNumber: z.string()
      .min(16, "מספר כרטיס אשראי לא תקין")
      .max(16, "מספר כרטיס אשראי לא תקין")
      .regex(/^\d+$/, "מספר כרטיס אשראי חייב להכיל ספרות בלבד"),
  });

// Types
export type Pizza = typeof pizzas.$inferSelect;
export type InsertPizza = z.infer<typeof insertPizzaSchema>;
export type Topping = typeof toppings.$inferSelect;
export type InsertTopping = z.infer<typeof insertToppingSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type PizzaOrderItem = z.infer<typeof pizzaOrderItemSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;