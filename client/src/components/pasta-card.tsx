import { MenuItem } from "@shared/schema";
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
import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SAUCE_OPTIONS = [
  { id: "cream", name: "שמנת", price: 0 },
  { id: "mushroom_cream", name: "שמנת פטריות", price: 0 },
  { id: "rosa", name: "רוזה", price: 0 },
  { id: "tomato", name: "עגבניות", price: 0 },
  { id: "spicy_tomato", name: "עגבניות חריף", price: 0 },
  { id: "pesto_cream", name: "שמנת פסטו", price: 0 },
  { id: "pesto", name: "פסטו", price: 0 },
];

const PARMESAN_PRICE = 300; // 3₪ לתוספת אקסטרא פרמז'ן

interface PastaCardProps {
  item: MenuItem;
  defaultSize?: "S" | "M" | "L" | "XL";
}

export function PastaCard({ item, defaultSize = "M" }: PastaCardProps) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [sauceChoices, setSauceChoices] = useState<string[]>(["cream"]);
  const [parmesanChoices, setParmesanChoices] = useState<boolean[]>([false]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creamSauceChoices, setCreamSauceChoices] = useState<boolean[]>(
    Array(1).fill(true)
  ); // Added for cream sauce switch
  const [veganCheeseChoices, setVeganCheeseChoices] = useState<boolean[]>(
    Array(1).fill(false)
  ); // Added for vegan cheese switch

  const updateQuantity = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    setSauceChoices((prev) => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill("cream")];
      }
      return prev.slice(0, validQuantity);
    });
    setParmesanChoices((prev) => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill(false)];
      }
      return prev.slice(0, validQuantity);
    });
    setCreamSauceChoices((prev) =>
      Array(validQuantity).fill(true)
    ); // Update cream sauce switch array
    setVeganCheeseChoices((prev) =>
      Array(validQuantity).fill(false)
    ); // Update vegan cheese switch array
  };

  const updateSauce = (index: number, sauceId: string) => {
    setSauceChoices((prev) => {
      const newChoices = [...prev];
      newChoices[index] = sauceId;
      return newChoices;
    });
  };

  const toggleParmesan = (index: number) => {
    setParmesanChoices((prev) => {
      const newChoices = [...prev];
      newChoices[index] = !newChoices[index];
      return newChoices;
    });
  };

  const toggleCreamSauce = (index: number) => {
    setCreamSauceChoices((prev) => {
      const newChoices = [...prev];
      newChoices[index] = !newChoices[index];
      return newChoices;
    });
  };

  const toggleVeganCheese = (index: number) => {
    setVeganCheeseChoices((prev) => {
      const newChoices = [...prev];
      newChoices[index] = !newChoices[index];
      return newChoices;
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const parmesanPrice = parmesanChoices.reduce((total, hasParmesan) =>
      total + (hasParmesan ? PARMESAN_PRICE : 0),
      0
    );
    return basePrice * quantity + parmesanPrice;
  };

  const handleAddToCart = () => {
    sauceChoices.forEach((sauceId, index) => {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          pizzaId: item.id,
          pizza: item,
          size: defaultSize,
          quantity: 1,
          toppingLayout: {
            layout: "full",
            sections: [[]],
          },
          isCreamSauce: creamSauceChoices[index], // Use cream sauce switch state
          isVeganCheese: veganCheeseChoices[index], // Use vegan cheese switch state
          sauceId,
          hasParmesan: parmesanChoices[index],
        },
      });
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setSauceChoices(["cream"]);
    setParmesanChoices([false]);
    setCreamSauceChoices(Array(1).fill(true)); // Reset cream sauce switch
    setVeganCheeseChoices(Array(1).fill(false)); // Reset vegan cheese switch
  };

  return (
    <Card className="w-full">
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
        <p className="text-sm text-muted-foreground text-center">
          {item.description}
        </p>
        <p className="text-sm text-muted-foreground text-center mt-2">
          * כל המנות מגיעות עם פרמז'ן בצד
        </p>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">בחר</Button>
          </DialogTrigger>
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

              <div className="space-y-4">
                <Label className="block text-right mb-2">הגדרות למנה:</Label>
                {sauceChoices.map((sauceId, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Select
                        value={sauceId}
                        onValueChange={(value) => updateSauce(index, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SAUCE_OPTIONS.map((sauce) => (
                            <SelectItem key={sauce.id} value={sauce.id}>
                              {sauce.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Label>רוטב למנה {index + 1}</Label>
                    </div>

                    <div className="space-y-4">
                      {/* רוטב שמנת */}
                      <div className="flex items-center justify-between flex-row-reverse">
                        <Label htmlFor={`cream-sauce-${index}`}>שמנת</Label>
                        <Switch
                          id={`cream-sauce-${index}`}
                          checked={creamSauceChoices[index]}
                          onCheckedChange={() => toggleCreamSauce(index)}
                        />
                      </div>

                      {/* גבינה טבעונית */}
                      <div className="flex items-center justify-between flex-row-reverse">
                        <Label htmlFor={`vegan-cheese-${index}`}>גבינה טבעונית</Label>
                        <Switch
                          id={`vegan-cheese-${index}`}
                          checked={veganCheeseChoices[index]}
                          onCheckedChange={() => toggleVeganCheese(index)}
                        />
                      </div>

                      {/* אקסטרא פרמז'ן */}
                      <div className="flex items-center justify-between flex-row-reverse">
                        <Label htmlFor={`parmesan-${index}`}>אקסטרא פרמז'ן (+ ₪3)</Label>
                        <Switch
                          id={`parmesan-${index}`}
                          checked={parmesanChoices[index]}
                          onCheckedChange={() => toggleParmesan(index)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
      </CardFooter>
    </Card>
  );
}