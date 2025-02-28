import { useQuery } from "@tanstack/react-query";
import { Category, MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BakedPotatoCard } from "@/components/baked-potato-card";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

const CATEGORY_IMAGES = {
  "פיצות": "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  "לחם שום": "https://images.unsplash.com/photo-1573140401552-3fab0b24306f",
  "פסטות": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  "רביולי": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a",
  "תפוח אדמה מוקרם": "https://images.unsplash.com/photo-1585148859491-003ab477e3d4",
  "סלטים": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  "משקאות": "https://images.unsplash.com/photo-1544145945-f90425340c7e",
  "תוספות חמות": "https://images.unsplash.com/photo-1585148859491-003ab477e3d4" // Added this line
};

const CATEGORY_DESCRIPTIONS = {
  "פיצות": "מגוון פיצות טריות בכל הגדלים",
  "לחם שום": "לחם שום בגדלים שונים",
  "פסטות": "פסטות באיכות מעולה",
  "רביולי": "רביולי באיכות מעולה במגוון מליות",
  "תפוח אדמה מוקרם": "תפוח אדמה מוקרם ברוטב שמנת",
  "סלטים": "סלטים טריים ומרעננים",
  "משקאות": "מבחר משקאות קרים",
};

export default function Menu() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useQuery<MenuData>({
    queryKey: ["/api/menu"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.categories || !data?.menuItems) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>לא נמצאו פריטים בתפריט</p>
      </div>
    );
  }

  const itemsByCategory = data.menuItems.reduce((acc, item) => {
    const categoryId = item.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<number, MenuItem[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">התפריט שלנו</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.categories
          .sort((a, b) => a.order - b.order)
          .map((category) => {
            const items = itemsByCategory[category.id] || [];
            if (items.length === 0) return null;

            const displayName = category.name === "תוספות חמות" ? "תפוח אדמה מוקרם" : category.name;
            const imageKey = category.name === "תוספות חמות" ? "תפוח אדמה מוקרם" : category.name;

            // אם זה תפוח אדמה מוקרם, נציג את הכרטיסייה עם אפשרויות הבחירה
            if (category.name === "תוספות חמות") {
              return <BakedPotatoCard key={category.id} item={items[0]} />;
            }

            return (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:bg-accent/5 transition-colors overflow-hidden"
                onClick={() => {
                  if (category.name === "פיצות") {
                    setLocation("/pizza-menu");
                  } else if (category.name === "לחם שום") {
                    setLocation("/garlic-bread-menu");
                  } else if (category.name === "פסטות" || category.name === "רביולי") {
                    setLocation("/pasta-menu");
                  }
                }}
              >
                <div className="aspect-video relative">
                  <img
                    src={CATEGORY_IMAGES[imageKey as keyof typeof CATEGORY_IMAGES] || ""}
                    alt={displayName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">{displayName}</h2>
                      <p className="text-muted-foreground">
                        {CATEGORY_DESCRIPTIONS[imageKey as keyof typeof CATEGORY_DESCRIPTIONS] || 
                          category.description || 
                          `${items.length} פריטים`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}