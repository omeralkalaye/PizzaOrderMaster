import { useQuery } from "@tanstack/react-query";
import { GarlicBreadCard } from "@/components/garlic-bread-card";
import { Category, MenuItem, itemSizes } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function GarlicBreadMenu() {
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
      <h1 className="text-3xl font-bold mb-8">תפריט לחם שום</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(itemSizes).map(([size, { name, priceMultiplier }]) => (
          <GarlicBreadCard
            key={`${baseGarlicBread.id}-${size}`}
            item={{
              ...baseGarlicBread,
              name: `לחם שום ${name}`,
              price: Math.round(baseGarlicBread.price * priceMultiplier),
              imageUrl: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f"
            }}
            defaultSize={size as "S" | "M" | "L" | "XL"}
          />
        ))}
      </div>
    </div>
  );
}