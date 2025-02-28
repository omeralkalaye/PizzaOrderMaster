import { MenuItem } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Topping } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BakedPotatoCardProps {
  item: MenuItem;
}

export function BakedPotatoCard({ item }: BakedPotatoCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<Array<number[]>>([[]]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPotato, setCurrentPotato] = useState(0);

  const { data: toppings } = useQuery<Topping[]>({
    queryKey: ["/api/toppings"],
  });

  const updateQuantity = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    setSelectedToppings(prev => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill([])];
      }
      return prev.slice(0, validQuantity);
    });
  };

  const handleToppingToggle = (potatoIndex: number, toppingId: number) => {
    setSelectedToppings(potatoes => {
      const newPotatoes = [...potatoes];
      const toppingsForPotato = [...(newPotatoes[potatoIndex] || [])];

      if (toppingsForPotato.includes(toppingId)) {
        newPotatoes[potatoIndex] = toppingsForPotato.filter(id => id !== toppingId);
      } else if (toppingsForPotato.length < 3) {
        newPotatoes[potatoIndex] = [...toppingsForPotato, toppingId];
      }

      return newPotatoes;
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const toppingsPrice = selectedToppings.reduce((total, potatoToppings) => {
      return total + potatoToppings.reduce((toppingTotal, toppingId) => {
        const topping = toppings?.find(t => t.id === toppingId);
        return toppingTotal + (topping?.price || 0);
      }, 0);
    }, 0);
    return basePrice * quantity + toppingsPrice;
  };

  const handleAddToCart = () => {
    selectedToppings.forEach((potatoToppings) => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          pizzaId: item.id,
          pizza: item,
          size: "M",
          quantity: 1,
          toppingLayout: {
            layout: "full",
            sections: [potatoToppings]
          },
          isCreamSauce: false,
          isVeganCheese: false,
        },
      });
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setSelectedToppings([[]]);
    setCurrentPotato(0);
  };

  return (
    <>
      <Card 
        className="w-full cursor-pointer hover:bg-accent/5 transition-colors"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-center">
            <span>{item.name}</span>
            <span className="text-lg">
              ₪{(item.price / 100).toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video relative rounded-md overflow-hidden mb-4">
            <img
              src={item.imageUrl || ""}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">{item.description}</p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto my-8">
          <DialogHeader>
            <DialogTitle className="text-center">{item.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Label>כמות</Label>
            </div>

            <Tabs value={currentPotato.toString()} onValueChange={(value) => setCurrentPotato(parseInt(value))}>
              <TabsList className="w-full flex-row-reverse">
                {selectedToppings.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    מנה {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {selectedToppings.map((potatoToppings, potatoIndex) => (
                <TabsContent key={potatoIndex} value={potatoIndex.toString()}>
                  <div className="space-y-4">
                    <Label className="block text-right mb-2">בחירת תוספות (עד 3):</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {toppings?.map(topping => {
                        const isSelected = potatoToppings.includes(topping.id);
                        const canSelect = !isSelected && potatoToppings.length < 3;

                        return (
                          <Button
                            key={topping.id}
                            variant={isSelected ? "secondary" : "outline"}
                            className="justify-end"
                            onClick={() => handleToppingToggle(potatoIndex, topping.id)}
                            disabled={!isSelected && !canSelect}
                          >
                            {topping.name} (₪{(topping.price / 100).toFixed(2)})
                            {isSelected && <CheckCircle2 className="w-4 h-4 ml-2" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-4 p-4 border rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>₪{(calculateTotalPrice() / 100).toFixed(2)}</span>
                <span>:סה"כ לתשלום</span>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full">
              הוסף לסל
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}