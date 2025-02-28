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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// מרכיבים אפשריים לסלט
const SALAD_INGREDIENTS = [
  { id: 1, name: "חסה" },
  { id: 2, name: "עגבניות שרי" },
  { id: 3, name: "מלפפון" },
  { id: 4, name: "פלפל" },
  { id: 5, name: "בצל סגול" },
  { id: 6, name: "גזר" },
  { id: 7, name: "תירס" },
  { id: 8, name: "זיתים שחורים" },
  { id: 9, name: "טונה" },
  { id: 10, name: "גבינה בולגרית" },
];

const BOILED_EGG_PRICE = 300; // 3₪ לביצה קשה

interface SaladCardProps {
  item: MenuItem;
}

export function SaladCard({ item }: SaladCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<Array<number[]>>([[]]);
  const [hasBoiledEgg, setHasBoiledEgg] = useState<boolean[]>([false]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSalad, setCurrentSalad] = useState(0);

  const updateQuantity = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    setSelectedIngredients(prev => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill([])];
      }
      return prev.slice(0, validQuantity);
    });
    setHasBoiledEgg(prev => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill(false)];
      }
      return prev.slice(0, validQuantity);
    });
  };

  const toggleIngredient = (saladIndex: number, ingredientId: number) => {
    setSelectedIngredients(salads => {
      const newSalads = [...salads];
      const ingredients = [...(newSalads[saladIndex] || [])];

      if (ingredients.includes(ingredientId)) {
        newSalads[saladIndex] = ingredients.filter(id => id !== ingredientId);
      } else {
        newSalads[saladIndex] = [...ingredients, ingredientId];
      }

      return newSalads;
    });
  };

  const toggleBoiledEgg = (index: number) => {
    setHasBoiledEgg(prev => {
      const newChoices = [...prev];
      newChoices[index] = !newChoices[index];
      return newChoices;
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const boiledEggPrice = hasBoiledEgg.reduce((total, hasEgg) =>
      total + (hasEgg ? BOILED_EGG_PRICE : 0), 0);
    return basePrice * quantity + boiledEggPrice;
  };

  const handleAddToCart = () => {
    selectedIngredients.forEach((ingredients, index) => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          pizzaId: item.id,
          pizza: item,
          size: "M",
          quantity: 1,
          toppingLayout: {
            layout: "full",
            sections: [ingredients]
          },
          isCreamSauce: false,
          isVeganCheese: false,
          hasBoiledEgg: hasBoiledEgg[index],
        },
      });
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setSelectedIngredients([[]]);
    setHasBoiledEgg([false]);
    setCurrentSalad(0);
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

            <Tabs value={currentSalad.toString()} onValueChange={(value) => setCurrentSalad(parseInt(value))}>
              <TabsList className="w-full flex-row-reverse">
                {selectedIngredients.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    מנה {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {selectedIngredients.map((saladIngredients, saladIndex) => (
                <TabsContent key={saladIndex} value={saladIndex.toString()}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Switch
                        checked={hasBoiledEgg[saladIndex]}
                        onCheckedChange={() => toggleBoiledEgg(saladIndex)}
                      />
                      <Label>ביצה קשה (+ ₪3)</Label>
                    </div>

                    <Label className="block text-right mb-2">בחירת מרכיבים:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {SALAD_INGREDIENTS.map(ingredient => {
                        const isSelected = saladIngredients.includes(ingredient.id);
                        return (
                          <Button
                            key={ingredient.id}
                            variant={isSelected ? "secondary" : "outline"}
                            className="justify-end"
                            onClick={() => toggleIngredient(saladIndex, ingredient.id)}
                          >
                            {ingredient.name}
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
