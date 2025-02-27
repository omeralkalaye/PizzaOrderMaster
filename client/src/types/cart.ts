import { Pizza, PizzaOrderItem } from "@shared/schema";

export interface CartItem extends PizzaOrderItem {
  pizza: Pizza;
  isCreamSauce?: boolean;
  isVeganCheese?: boolean;
}
