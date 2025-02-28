import { Pizza, ItemSize, ToppingLayout, DoughType } from "@shared/schema";

export interface CartItem {
  pizzaId: number;
  pizza: Pizza;
  size: ItemSize;
  quantity: number;
  toppingLayout: {
    layout: ToppingLayout;
    sections: number[][];
  };
  doughType: DoughType;
  isCreamSauce?: boolean;
  isVeganCheese?: boolean;
}