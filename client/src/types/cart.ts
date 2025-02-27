import { Pizza, PizzaSize, ToppingLayout } from "@shared/schema";

export interface CartItem {
  pizzaId: number;
  pizza: Pizza;
  size: PizzaSize;
  quantity: number;
  toppingLayout: {
    layout: ToppingLayout;
    sections: number[][];
  };
  isCreamSauce?: boolean;
  isVeganCheese?: boolean;
}
