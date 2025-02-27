import { createContext, useContext, useReducer, ReactNode } from "react";
import { Pizza, PizzaOrderItem, PizzaSize, ToppingLayout } from "@shared/schema";

interface CartItem extends PizzaOrderItem {
  pizza: Pizza;
  isCreamSauce?: boolean;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { pizzaId: number; quantity: number } }
  | { type: "CLEAR" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if the same pizza with the same size, sauce and toppings layout exists
      const existingIndex = state.items.findIndex(
        item =>
          item.pizzaId === action.payload.pizzaId &&
          item.size === action.payload.size &&
          item.isCreamSauce === action.payload.isCreamSauce &&
          JSON.stringify(item.toppingLayout) === JSON.stringify(action.payload.toppingLayout)
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity
        };
        return { ...state, items: newItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.pizzaId !== action.payload)
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.pizzaId === action.payload.pizzaId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case "CLEAR":
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
    // Calculate base price
    let itemTotal = item.pizza.price;

    // Add cream sauce price if selected
    if (item.isCreamSauce) {
      itemTotal += 500; // 5₪ for cream sauce
    }

    // Add toppings price
    item.toppingLayout.sections.forEach(section => {
      section.forEach(toppingId => {
        // Here you would need to get the topping price from somewhere
        // For now, we'll use a fixed price of 5₪ per topping
        itemTotal += 500;
      });
    });

    return total + (itemTotal * item.quantity);
  }, 0);
}