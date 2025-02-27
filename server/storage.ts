import { Pizza, InsertPizza, Order, InsertOrder, OrderStatus } from "@shared/schema";

export interface IStorage {
  // Pizza operations
  getPizzas(): Promise<Pizza[]>;
  getPizza(id: number): Promise<Pizza | undefined>;
  createPizza(pizza: InsertPizza): Promise<Pizza>;
  updatePizza(id: number, pizza: Partial<InsertPizza>): Promise<Pizza | undefined>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private pizzas: Map<number, Pizza>;
  private orders: Map<number, Order>;
  private pizzaId: number = 1;
  private orderId: number = 1;

  constructor() {
    this.pizzas = new Map();
    this.orders = new Map();
    
    // Add some default pizzas
    const defaultPizzas: InsertPizza[] = [
      {
        name: "Margherita",
        description: "Classic tomato sauce with mozzarella",
        price: 1200,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        available: true,
      },
      {
        name: "Pepperoni",
        description: "Tomato sauce, mozzarella, and pepperoni",
        price: 1400,
        imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee",
        available: true,
      },
      // Add more default pizzas...
    ];

    defaultPizzas.forEach(pizza => this.createPizza(pizza));
  }

  async getPizzas(): Promise<Pizza[]> {
    return Array.from(this.pizzas.values());
  }

  async getPizza(id: number): Promise<Pizza | undefined> {
    return this.pizzas.get(id);
  }

  async createPizza(pizza: InsertPizza): Promise<Pizza> {
    const id = this.pizzaId++;
    const newPizza = { ...pizza, id };
    this.pizzas.set(id, newPizza);
    return newPizza;
  }

  async updatePizza(id: number, pizza: Partial<InsertPizza>): Promise<Pizza | undefined> {
    const existing = this.pizzas.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...pizza };
    this.pizzas.set(id, updated);
    return updated;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const newOrder = { ...order, id, createdAt: new Date() };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, status };
    this.orders.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
