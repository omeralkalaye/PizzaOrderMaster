import { useQuery } from "@tanstack/react-query";
import { PastryCard } from "@/components/pastry-card";
import { Category, MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function PastriesMenu() {
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

  const pastriesCategory = data.categories.find(c => c.name === "מאפים");
  if (!pastriesCategory) return null;

  const pastries = data.menuItems.filter(item => item.categoryId === pastriesCategory.id);
  if (pastries.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">תפריט מאפים</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pastries.map((pastry) => (
          <PastryCard
            key={pastry.id}
            item={pastry}
          />
        ))}
      </div>
    </div>
  );
}
