import { createContext, useContext, useReducer, ReactNode } from "react";
import { Pizza, PizzaOrderItem } from "@shared/schema";

interface CartItem extends PizzaOrderItem {
  pizza: Pizza;
  isCreamSauce?: boolean;
  isVeganCheese?: boolean;
  isGratin?: boolean; // אופציית הקרמה עבור לחם שום
  sauceId?: string; // אופציית הרוטב עבור פסטות
  hasParmesan?: boolean; // אופציית פרמז'ן עבור פסטות
  hasBoiledEgg?: boolean; // אופציית ביצה קשה עבור סלט
  extraCheese?: boolean; // Added for pastries
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

function areItemsEqual(item1: CartItem, item2: CartItem): boolean {
  return (
    item1.pizzaId === item2.pizzaId &&
    item1.size === item2.size &&
    item1.isCreamSauce === item2.isCreamSauce &&
    item1.isVeganCheese === item2.isVeganCheese &&
    item1.isGratin === item2.isGratin &&
    item1.sauceId === item2.sauceId &&
    item1.hasParmesan === item2.hasParmesan &&
    item1.hasBoiledEgg === item2.hasBoiledEgg &&
    item1.doughType === item2.doughType &&
    item1.extraCheese === item2.extraCheese && // Added for pastries
    JSON.stringify(item1.toppingLayout) === JSON.stringify(item2.toppingLayout)
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      // Find existing identical item
      const existingItemIndex = state.items.findIndex(item =>
        areItemsEqual(item, action.payload)
      );

      if (existingItemIndex >= 0) {
        // If item exists, update its quantity
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
        return { ...state, items: newItems };
      }

      // If no identical item exists, add new item
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.pizzaId !== action.payload)
      };
    case "UPDATE_QUANTITY": {
      const { pizzaId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.pizzaId === pizzaId
            ? { ...item, quantity }
            : item
        )
      };
    }
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
    let itemTotal = item.pizza.price;

    // Add cream sauce price if selected
    if (item.isCreamSauce) {
      itemTotal += 500; // 5₪ for cream sauce
    }

    // Add gratin price if selected (for garlic bread)
    if (item.isGratin) {
      itemTotal += 300; // 3₪ for gratin
    }

    // Add parmesan price if selected (for pasta)
    if (item.hasParmesan) {
      itemTotal += 300; // 3₪ for parmesan
    }

    // Add boiled egg price if selected (for salad)
    if (item.hasBoiledEgg) {
      itemTotal += 300; // 3₪ for boiled egg
    }

    // Add extra cheese price if selected (for pastries)
    if (item.extraCheese) {
      itemTotal += 300; // 3₪ for extra cheese
    }

    // Add toppings price
    item.toppingLayout.sections.forEach(section => {
      section.forEach(toppingId => {
        itemTotal += 500; // 5₪ per topping
      });
    });

    return total + (itemTotal * item.quantity);
  }, 0);
}