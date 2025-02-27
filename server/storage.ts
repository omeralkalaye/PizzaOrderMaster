import { Pizza, InsertPizza, Order, InsertOrder, OrderStatus, Topping, InsertTopping } from "@shared/schema";

export interface IStorage {
  // Pizza operations
  getPizzas(): Promise<Pizza[]>;
  getPizza(id: number): Promise<Pizza | undefined>;
  createPizza(pizza: InsertPizza): Promise<Pizza>;
  updatePizza(id: number, pizza: Partial<InsertPizza>): Promise<Pizza | undefined>;

  // Topping operations
  getToppings(): Promise<Topping[]>;
  getTopping(id: number): Promise<Topping | undefined>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private pizzas: Map<number, Pizza>;
  private toppings: Map<number, Topping>;
  private orders: Map<number, Order>;
  private pizzaId: number = 1;
  private toppingId: number = 1;
  private orderId: number = 1;

  constructor() {
    this.pizzas = new Map();
    this.toppings = new Map();
    this.orders = new Map();

    // Add default toppings
    const defaultToppings: InsertTopping[] = [
      {
        name: "גבינת מוצרלה נוספת",
        price: 600,
        imageUrl: "https://example.com/mozzarella.jpg",
        available: true,
      },
      {
        name: "פטריות",
        price: 400,
        imageUrl: "https://example.com/mushrooms.jpg",
        available: true,
      },
      {
        name: "בצל",
        price: 300,
        imageUrl: "https://example.com/onion.jpg",
        available: true,
      },
      {
        name: "זיתים שחורים",
        price: 400,
        imageUrl: "https://example.com/olives.jpg",
        available: true,
      },
      {
        name: "פלפל",
        price: 300,
        imageUrl: "https://example.com/pepper.jpg",
        available: true,
      },
    ];

    defaultToppings.forEach(topping => {
      const id = this.toppingId++;
      this.toppings.set(id, { ...topping, id });
    });

    // Add default pizzas
    const defaultPizzas: InsertPizza[] = [
      {
        name: "מרגריטה",
        description: "רוטב עגבניות, גבינת מוצרלה ובזיליקום טרי",
        price: 4000, // 40 ₪ for size S
        imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
        available: true,
      },
      {
        name: "ארבע גבינות",
        description: "מוצרלה, פרמזן, גורגונזולה וריקוטה",
        price: 4500,
        imageUrl: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
        available: true,
      },
      {
        name: "פטריות",
        description: "רוטב עגבניות, מוצרלה ופטריות טריות",
        price: 4200,
        imageUrl: "https://images.unsplash.com/photo-1571066811602-716837d681de",
        available: true,
      },
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

  async getToppings(): Promise<Topping[]> {
    return Array.from(this.toppings.values());
  }

  async getTopping(id: number): Promise<Topping | undefined> {
    return this.toppings.get(id);
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