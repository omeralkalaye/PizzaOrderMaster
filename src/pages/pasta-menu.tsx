import { useQuery } from "@tanstack/react-query";
import { PastaCard } from "@/components/pasta-card";
import { Category, MenuItem } from "@/types/schema";
import { Skeleton } from "@/components/ui/skeleton";

const PASTA_IMAGES = {
  "פסטה פנה": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  "פסטה פטוצ'יני": "https://images.unsplash.com/photo-1645112411341-6c4fd023402c",
  "רביולי גבינה": "https://images.unsplash.com/photo-1619740455993-9e612b1af08a",
  "רביולי בטטה": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
};

const mockMenuData = {
  categories: [],
  menuItems: [
    {
      id: 101,
      name: "פסטה פנה",
      description: "פסטה פנה באיכות מעולה",
      price: 4500,
      imageUrl: PASTA_IMAGES["פסטה פנה"],
      available: true,
      categoryId: 3,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 102,
      name: "פסטה פטוצ'יני",
      description: "פסטה פטוצ'יני באיכות מעולה",
      price: 4500,
      imageUrl: PASTA_IMAGES["פסטה פטוצ'יני"],
      available: true,
      categoryId: 3,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 103,
      name: "רביולי גבינה",
      description: "רביולי במילוי גבינות איכותיות",
      price: 5000,
      imageUrl: PASTA_IMAGES["רביולי גבינה"],
      available: true,
      categoryId: 4,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 104,
      name: "רביולי בטטה",
      description: "רביולי במילוי בטטה מתוקה",
      price: 5000,
      imageUrl: PASTA_IMAGES["רביולי בטטה"],
      available: true,
      categoryId: 4,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
  ]
};

export default function PastaMenu() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/menu"],
    queryFn: () => Promise.resolve(mockMenuData),
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

  const pastas = data.menuItems;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">תפריט פסטות ורביולי</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pastas.map((pasta) => (
          <PastaCard
            key={pasta.id}
            item={pasta}
          />
        ))}
      </div>
    </div>
  );
}