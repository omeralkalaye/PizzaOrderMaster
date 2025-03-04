import { Category, MenuItem } from "@/types/schema";

export const CATEGORY_IMAGES = {
  "פיצות": "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  "לחם שום": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c",
  "פסטות": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  "רביולי": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a",
  "מאפים": "https://images.unsplash.com/photo-1597589022928-bb4002c099ec",
  "סלטים": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  "משקאות": "https://images.unsplash.com/photo-1544145945-f90425340c7e",
};

export const CATEGORY_DESCRIPTIONS = {
  "פיצות": "מבחר פיצות טריות ואיכותיות",
  "לחם שום": "לחם שום טרי ומפנק",
  "פסטות": "מגוון פסטות טריות",
  "רביולי": "רביולי במילויים שונים",
  "מאפים": "מאפים טריים מהתנור",
  "סלטים": "סלטים טריים ובריאים",
  "משקאות": "מבחר משקאות קרים",
};

export const mockCategories: Category[] = [
  { id: 1, name: "פיצות", order: 1, imageUrl: CATEGORY_IMAGES["פיצות"], description: CATEGORY_DESCRIPTIONS["פיצות"] },
  { id: 2, name: "לחם שום", order: 2, imageUrl: CATEGORY_IMAGES["לחם שום"], description: CATEGORY_DESCRIPTIONS["לחם שום"] },
  { id: 3, name: "פסטות", order: 3, imageUrl: CATEGORY_IMAGES["פסטות"], description: CATEGORY_DESCRIPTIONS["פסטות"] },
  { id: 4, name: "רביולי", order: 4, imageUrl: CATEGORY_IMAGES["רביולי"], description: CATEGORY_DESCRIPTIONS["רביולי"] },
  { id: 5, name: "מאפים", order: 5, imageUrl: CATEGORY_IMAGES["מאפים"], description: CATEGORY_DESCRIPTIONS["מאפים"] },
  { id: 6, name: "סלטים", order: 6, imageUrl: CATEGORY_IMAGES["סלטים"], description: CATEGORY_DESCRIPTIONS["סלטים"] },
  { id: 7, name: "משקאות", order: 7, imageUrl: CATEGORY_IMAGES["משקאות"], description: CATEGORY_DESCRIPTIONS["משקאות"] },
];

export const mockMenuItems: MenuItem[] = [];  // We'll populate this with our menu items in separate category files