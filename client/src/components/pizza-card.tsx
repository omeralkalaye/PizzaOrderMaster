import { Pizza, PizzaSize, pizzaSizes, ToppingLayout } from "@shared/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Topping } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";

interface PizzaCardProps {
  pizza: Pizza;
  isAdmin?: boolean;
  onEdit?: (pizza: Pizza) => void;
  defaultSize?: PizzaSize;
}

export function PizzaCard({ pizza, isAdmin, onEdit, defaultSize = "M" }: PizzaCardProps) {
  const { dispatch } = useCart();
  const [size, setSize] = useState<PizzaSize>(defaultSize);
  const [layout, setLayout] = useState<ToppingLayout>("full");
  const [selectedToppings, setSelectedToppings] = useState<number[][]>([[]]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: toppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const sections = layout === "full" ? 1 : layout === "half" ? 2 : 4;

  const handleToppingToggle = (sectionIndex: number, toppingId: number) => {
    setSelectedToppings(current => {
      const newToppings = [...current];
      const section = newToppings[sectionIndex] || [];

      if (section.includes(toppingId)) {
        newToppings[sectionIndex] = section.filter(id => id !== toppingId);
      } else if (section.length < 3) {
        newToppings[sectionIndex] = [...section, toppingId];
      }

      return newToppings;
    });
  };

  const calculatePrice = () => {
    const basePrice = pizza.price * pizzaSizes[size].priceMultiplier;
    const toppingsPrice = selectedToppings.flat().reduce((total, toppingId) => {
      const topping = toppings?.find(t => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return basePrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        pizzaId: pizza.id,
        pizza,
        size,
        quantity: 1,
        toppingLayout: {
          layout,
          sections: selectedToppings
        },
      },
    });
    setIsDialogOpen(false);
    setSize("M");
    setLayout("full");
    setSelectedToppings([[]]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{pizza.name}</span>
          <span className="text-lg">
            ₪{(pizza.price / 100).toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative rounded-md overflow-hidden mb-4">
          <img
            src={pizza.imageUrl}
            alt={pizza.name}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-sm text-muted-foreground">{pizza.description}</p>
      </CardContent>
      <CardFooter>
        {isAdmin ? (
          <Button
            className="w-full"
            onClick={() => onEdit?.(pizza)}
          >
            ערוך פיצה
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">הוסף לסל</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>הוסף {pizza.name} לסל</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* בחירת גודל */}
                <div>
                  <label className="text-sm font-medium mb-2 block">בחר גודל</label>
                  <Select value={size} onValueChange={(value: PizzaSize) => setSize(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(pizzaSizes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key} (x{value.priceMultiplier})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* בחירת פריסת תוספות */}
                <div>
                  <label className="text-sm font-medium mb-2 block">בחר פריסת תוספות</label>
                  <Select value={layout} onValueChange={(value: ToppingLayout) => {
                    setLayout(value as ToppingLayout);
                    setSelectedToppings(Array(value === "full" ? 1 : value === "half" ? 2 : 4).fill([]));
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">על כל הפיצה</SelectItem>
                      <SelectItem value="half">חצי-חצי</SelectItem>
                      <SelectItem value="quarter">רבעים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* בחירת תוספות */}
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="w-full justify-start">
                    {Array.from({ length: sections }, (_, i) => (
                      <TabsTrigger key={i} value={i.toString()}>
                        {layout === "full" ? "תוספות" :
                         layout === "half" ? `חצי ${i + 1}` :
                         `רבע ${i + 1}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Array.from({ length: sections }, (_, sectionIndex) => (
                    <TabsContent key={sectionIndex} value={sectionIndex.toString()}>
                      <div className="grid grid-cols-2 gap-2">
                        {toppings?.map(topping => {
                          const isSelected = selectedToppings[sectionIndex]?.includes(topping.id);
                          const canSelect = !isSelected && (!selectedToppings[sectionIndex] || selectedToppings[sectionIndex].length < 3);

                          return (
                            <Button
                              key={topping.id}
                              variant={isSelected ? "secondary" : "outline"}
                              className="justify-start"
                              onClick={() => handleToppingToggle(sectionIndex, topping.id)}
                              disabled={!isSelected && !canSelect}
                            >
                              {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                              {topping.name} (₪{(topping.price / 100).toFixed(2)})
                            </Button>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <Button onClick={handleAddToCart} className="w-full mt-4">
                הוסף לסל - ₪{(calculatePrice() / 100).toFixed(2)}
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}