import { useQuery } from "@tanstack/react-query";
import { PizzaCard } from "@/components/pizza-card";
import { Category, MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

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

            return (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => {
                  if (category.name === "פיצות") {
                    setLocation("/pizza-menu");
                  } else if (category.name === "לחם שום") {
                    setLocation("/garlic-bread-menu");
                  }
                }}
              >
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
                  <p className="text-muted-foreground">
                    {category.description || `${items.length} פריטים`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}