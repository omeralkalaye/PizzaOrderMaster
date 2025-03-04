import { createContext, useContext, useReducer, ReactNode } from "react";
import { Pizza, MenuItem } from "@/types/schema";

interface CartItem {
  id: number;
  item: MenuItem;
  quantity: number;
  options?: {
    size?: "small" | "medium" | "large";
    isCreamSauce?: boolean;
    isVeganCheese?: boolean;
    isGratin?: boolean;
    extraCheese?: boolean;
    toppings?: string[];
  };
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
        JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
        return { ...state, items: newItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id
            ? { ...item, quantity }
            : item
        )
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    let itemPrice = item.item.price;

    // Add options prices
    if (item.options) {
      if (item.options.isCreamSauce) itemPrice += 500; // 5₪
      if (item.options.isGratin) itemPrice += 300; // 3₪
      if (item.options.extraCheese) itemPrice += 300; // 3₪
      if (item.options.toppings) {
        itemPrice += item.options.toppings.length * 500; // 5₪ per topping
      }
    }

    return total + (itemPrice * item.quantity);
  }, 0);
}