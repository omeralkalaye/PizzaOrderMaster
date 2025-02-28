import { useQuery } from "@tanstack/react-query";
import { PizzaCard } from "@/components/pizza-card";
import { Category, MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function Menu() {
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
      {data.categories
        .sort((a, b) => a.order - b.order)
        .map((category) => {
          const items = itemsByCategory[category.id] || [];
          if (items.length === 0) return null;

          return (
            <div key={category.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <PizzaCard
                    key={item.id}
                    pizza={{
                      ...item,
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      imageUrl: item.imageUrl || "",
                      available: item.available,
                    }}
                    defaultSize={item.allowsSizes ? "M" : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}