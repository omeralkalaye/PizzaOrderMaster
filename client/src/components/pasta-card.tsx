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

  const updateQuantity = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    setSauceChoices(prev => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill("cream")];
      }
      return prev.slice(0, validQuantity);
    });
    setParmesanChoices(prev => {
      if (validQuantity > prev.length) {
        return [...prev, ...Array(validQuantity - prev.length).fill(false)];
      }
      return prev.slice(0, validQuantity);
    });
  };

  const updateSauce = (index: number, sauceId: string) => {
    setSauceChoices(prev => {
      const newChoices = [...prev];
      newChoices[index] = sauceId;
      return newChoices;
    });
  };

  const toggleParmesan = (index: number) => {
    setParmesanChoices(prev => {
      const newChoices = [...prev];
      newChoices[index] = !newChoices[index];
      return newChoices;
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const parmesanPrice = parmesanChoices.reduce((total, hasParmesan) => 
      total + (hasParmesan ? PARMESAN_PRICE : 0), 0);
    return basePrice * quantity + parmesanPrice;
  };

  const handleAddToCart = () => {
    // Add each pasta as a separate item with its own sauce choice and parmesan option
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
            sections: [[]]
          },
          isCreamSauce: false,
          isVeganCheese: false,
          sauceId,
          hasParmesan: parmesanChoices[index],
        },
      });
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setSauceChoices(["cream"]);
    setParmesanChoices([false]);
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
        <p className="text-sm text-muted-foreground text-center">{item.description}</p>
        <p className="text-sm text-muted-foreground text-center mt-2">* כל המנות מגיעות עם פרמז'ן בצד</p>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">בחר</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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

                    <div className="flex items-center justify-between">
                      <Switch
                        checked={parmesanChoices[index]}
                        onCheckedChange={() => toggleParmesan(index)}
                      />
                      <Label>אקסטרא פרמז'ן (+ ₪3)</Label>
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