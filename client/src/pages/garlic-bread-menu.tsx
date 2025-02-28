import { useQuery } from "@tanstack/react-query";
import { PizzaCard } from "@/components/pizza-card";
import { Category, MenuItem, itemSizes } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function GarlicBreadMenu() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useQuery<MenuData>({
    queryKey: ["/api/menu"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  const garlicBreadCategory = data.categories.find(c => c.name === "לחם שום");
  if (!garlicBreadCategory) return null;

  const garlicBreads = data.menuItems.filter(item => item.categoryId === garlicBreadCategory.id);
  if (garlicBreads.length === 0) return null;

  const baseGarlicBread = garlicBreads[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => setLocation("/menu")}
        >
          <ChevronRight className="h-4 w-4" />
          חזרה לתפריט
        </Button>
        <h1 className="text-3xl font-bold">תפריט לחם שום</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(itemSizes).map(([size, { name, priceMultiplier }]) => (
          <PizzaCard
            key={`${baseGarlicBread.id}-${size}`}
            pizza={{
              ...baseGarlicBread,
              name: `לחם שום ${name}`,
              price: Math.round(baseGarlicBread.price * priceMultiplier)
            }}
            defaultSize={size as "S" | "M" | "L" | "XL"}
          />
        ))}
      </div>
    </div>
  );
}
