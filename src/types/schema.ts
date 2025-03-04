// Local type definitions without backend dependencies
export type Category = {
  id: number;
  name: string;
  order: number;
  description?: string;
  imageUrl?: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  categoryId: number;
  allowsToppings: boolean;
  allowsSizes: boolean;
  allowsSauces: boolean;
  isCustomizable: boolean;
};

export type Pizza = MenuItem & {
  isSpicy?: boolean;
  isVegan?: boolean;
};

export type ItemSize = "small" | "medium" | "large";
export type ToppingLayout = "full" | "left" | "right";
export type DoughType = "regular" | "thin" | "thick";