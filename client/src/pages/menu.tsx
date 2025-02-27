import { useQuery } from "@tanstack/react-query";
import { PizzaCard } from "@/components/pizza-card";
import { Pizza, pizzaSizes } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const { data: pizzas, isLoading } = useQuery<Pizza[]>({
    queryKey: ["/api/pizzas"],
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

  const basePizza = pizzas?.[0];

  if (!basePizza) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">התפריט שלנו</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(pizzaSizes).map(([size, { name, priceMultiplier }]) => (
          <PizzaCard 
            key={size} 
            pizza={{
              ...basePizza,
              name: `פיצה ${name}`,
              price: Math.round(basePizza.price * priceMultiplier)
            }}
            defaultSize={size as "S" | "M" | "L" | "XL"}
          />
        ))}
      </div>
    </div>
  );
}