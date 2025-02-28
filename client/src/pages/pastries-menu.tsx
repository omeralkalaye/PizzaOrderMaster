import { useQuery } from "@tanstack/react-query";
import { PastryCard } from "@/components/pastry-card";
import { Category, MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type MenuData = {
  categories: Category[];
  menuItems: MenuItem[];
}

const PASTRY_IMAGES = {
  "מלאווח פתוח": "https://images.unsplash.com/photo-1588951094912-19ed30d3f40c",
  "מלאווח משובח": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04",
  "מלאווח יווני": "https://images.unsplash.com/photo-1559561821-8f21b6e6f26c",
  "מלאווח מעורב": "https://images.unsplash.com/photo-1591985666643-1ecc67616216",
  "מלאווח טוניסאי": "https://images.unsplash.com/photo-1591985666904-4059c35db9a7",
  "מלאווח הבית": "https://images.unsplash.com/photo-1591985666615-b38181e6c21a",
  "ג'חנון": "https://images.unsplash.com/photo-1589367920963-d60e0ca6dcb9",
};

export default function PastriesMenu() {
  const { data, isLoading } = useQuery<MenuData>({
    queryKey: ["/api/menu"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(7)].map((_, i) => (
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

  const pastries = [
    {
      id: 201,
      name: "מלאווח פתוח",
      description: "מלאווח טרי ופריך עם שמן זית",
      price: 2500,
      imageUrl: PASTRY_IMAGES["מלאווח פתוח"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 202,
      name: "מלאווח משובח",
      description: "מלאווח במילוי גבינות משובחות",
      price: 3000,
      imageUrl: PASTRY_IMAGES["מלאווח משובח"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 203,
      name: "מלאווח יווני",
      description: "מלאווח במילוי גבינה פטה וזיתים",
      price: 3000,
      imageUrl: PASTRY_IMAGES["מלאווח יווני"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 204,
      name: "מלאווח מעורב",
      description: "מלאווח במילוי גבינות מעורבות",
      price: 3000,
      imageUrl: PASTRY_IMAGES["מלאווח מעורב"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 205,
      name: "מלאווח טוניסאי",
      description: "מלאווח חריף בסגנון טוניסאי",
      price: 3000,
      imageUrl: PASTRY_IMAGES["מלאווח טוניסאי"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 206,
      name: "מלאווח הבית",
      description: "מלאווח מיוחד של השף",
      price: 3500,
      imageUrl: PASTRY_IMAGES["מלאווח הבית"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
    {
      id: 207,
      name: "ג'חנון",
      description: "ג'חנון תימני מסורתי",
      price: 2500,
      imageUrl: PASTRY_IMAGES["ג'חנון"],
      available: true,
      categoryId: 5,
      allowsToppings: false,
      allowsSizes: false,
      allowsSauces: false,
      isCustomizable: false,
    },
  ];

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