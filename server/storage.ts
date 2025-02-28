import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import {
  users,
  categories,
  menuItems,
  toppings,
  orders,
  paymentMethods,
  type Category,
  type MenuItem,
  type Order,
  type InsertOrder,
  type Topping,
  type InsertTopping,
  type User,
  type InsertUser,
  type PaymentMethod,
  type InsertPaymentMethod,
  OrderStatus,
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Menu operations
  getCategories(): Promise<Category[]>;
  getMenuItems(): Promise<MenuItem[]>;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Topping operations
  getToppings(): Promise<Topping[]>;
  getTopping(id: number): Promise<Topping | undefined>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined>;

  // Payment method operations
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  getPaymentMethods(userId: number): Promise<PaymentMethod[]>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // Menu operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Topping operations
  async getToppings(): Promise<Topping[]> {
    return db.select().from(toppings);
  }

  async getTopping(id: number): Promise<Topping | undefined> {
    const [topping] = await db.select().from(toppings).where(eq(toppings.id, id));
    return topping;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Payment method operations
  async createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const [newPaymentMethod] = await db
      .insert(paymentMethods)
      .values(paymentMethod)
      .returning();
    return newPaymentMethod;
  }

  async getPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    return db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId));
  }
}

export const storage = new DatabaseStorage();