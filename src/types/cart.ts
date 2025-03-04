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
  isGratin?: boolean; // אופציית הקרמה עבור לחם שום
  sauceId?: string; // אופציית הרוטב עבור פסטות
  hasParmesan?: boolean; // אופציית פרמז'ן עבור פסטות
  hasBoiledEgg?: boolean; // אופציית ביצה קשה עבור סלט
  isSpicy?: boolean; // אופציית חריף עבור מאפים
  extraSpicy?: number; // כמות חריף נוסף בתשלום
  smallSauce?: number; // כמות רסק קטן
  largeSauce?: number; // כמות רסק גדול
  removedIngredients?: string[]; // מרכיבים שהוסרו
}